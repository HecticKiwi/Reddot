"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/prisma/profile";
import { communityDto } from "@/schemas/community";
import { Community, Prisma, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Score } from "./post";
import { longFormatters } from "date-fns";
import { db } from "@/lib/drizzle";
import {
  communityMods,
  communityTable,
  postTable,
  voteTable,
} from "../../drizzle/schema";
import { SQL, and, desc, eq, getTableColumns, gt, inArray } from "drizzle-orm";
import { PgTableWithColumns } from "drizzle-orm/pg-core";

export type CommunityWithMods = Community & {
  moderators: User[];
};

export type CommunityThing = Partial<Community> & {
  image: File | null;
};

export async function isCommunityNameAvailable(name: string) {
  const community = await db.query.communityTable.findFirst({
    where: eq(communityTable.name, name),
  });
  // const community = await prisma.community.findUnique({
  //   where: {
  //     name,
  //   },
  // });

  return !community;
}

export async function createCommunity(data: communityDto) {
  const profile = await getCurrentUser();

  // const community = await prisma.community.create({
  //   data: {
  //     ...data,
  //     moderators: {
  //       connect: {
  //         id: profile.id,
  //       },
  //     },
  //     members: {
  //       connect: {
  //         id: profile.id,
  //       },
  //     },
  //   },
  // });

  const [community] = await db
    .insert(communityTable)
    .values({
      ...data,
    })
    .returning();

  await db.insert(communityMods).values({
    a: community.id,
    b: profile.id,
  });

  return community.name;
}

export async function searchCommunitiesByName(
  name: string,
): Promise<Community[]> {
  if (!name) {
    return [];
  }

  return await prisma.community.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
    take: 10,
  });
}

export async function updateCommunity({
  communityId,
  data,
}: {
  communityId: string;
  data: Partial<communityDto>;
}) {
  const community = await prisma.community.update({
    where: {
      name: communityId,
    },
    data,
  });

  return community;
}

export async function joinOrLeaveCommunity({
  communityId,
}: {
  communityId: string;
}) {
  const profile = await getCurrentUser();

  const where: Prisma.UserWhereUniqueInput = {
    id: profile.id,
    communitiesAsMember: {
      some: {
        id: communityId,
      },
    },
  };

  const hasJoined = await prisma.user.findUnique({
    where,
  });

  if (hasJoined) {
    await prisma.user.update({
      where,
      data: {
        communitiesAsMember: {
          disconnect: {
            id: communityId,
          },
        },
      },
    });
  } else {
    await prisma.user.update({
      where: {
        id: profile.id,
      },
      data: {
        communitiesAsMember: {
          connect: {
            id: communityId,
          },
        },
      },
    });
  }

  revalidatePath("/");

  return !hasJoined;
}

export async function getPosts({
  type,
  id,
  pageParam,
  orderBy: orderByType,
}: {
  type: "user" | "community";
  id: number | null;
  pageParam?: number;
  orderBy: "new" | "top";
}) {
  const user = await getCurrentUser();

  console.log(id);

  const take = 5;

  const communitiesAsMemberIds = user.communitiesAsMember.map(
    (community) => community.community.id,
  );

  let newWhere: any = eq(postTable.removed, false);

  if (pageParam) [(newWhere = and(newWhere, gt(postTable.id, pageParam)))];

  const community = await db.query.communityTable.findFirst({
    where: eq(communityTable.name, id),
  });

  if (type === "user") {
    if (id === null) {
      if (communitiesAsMemberIds.length > 0) {
        newWhere = and(newWhere, inArray(postTable.id, communitiesAsMemberIds));
      } else {
        return [];
      }
    } else {
      newWhere = and(newWhere, eq(postTable.authorId, id));
    }
  } else {
    if (id === null) {
    } else {
      newWhere = and(newWhere, eq(postTable.communityId, id));
      // HERE
    }
  }

  const newOrderBy =
    orderByType === "new"
      ? [desc(postTable.createdAt)]
      : [desc(postTable.score)];

  const posts2 = await db.query.postTable.findMany({
    where: newWhere,
    orderBy: newOrderBy,
    with: {
      author: true,
      community: true,
      comments: {
        columns: {
          id: true,
        },
      },
      votes: {
        where: eq(voteTable.id, user.id),
      },
    },
    limit: take,
  });

  return posts2;
}
