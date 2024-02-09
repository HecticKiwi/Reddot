"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/prisma/profile";
import { communityDto } from "@/schemas/community";
import { Community, Prisma, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Score } from "./post";
import { longFormatters } from "date-fns";
import { db } from "@/lib/drizzle";
import { communityTable, modUsersToCommunities } from "../../drizzle/schema";

export type CommunityWithMods = Community & {
  moderators: User[];
};

export type CommunityThing = Partial<Community> & {
  image: File | null;
};

export async function isCommunityNameAvailable(name: string) {
  const community = await prisma.community.findUnique({
    where: {
      name,
    },
  });

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

  await db.insert(modUsersToCommunities).values({
    communityId: community.id,
    userId: profile.id,
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
  id: string | null;
  pageParam?: string;
  orderBy: "new" | "top";
}) {
  const user = await getCurrentUser();

  const take = 5;
  const cursor = pageParam
    ? {
        id: pageParam,
      }
    : undefined;
  const skip = cursor ? 1 : 0;

  const communitiesAsMemberIds = user.communitiesAsMember.map(
    (community) => community.id,
  );

  const where: Prisma.PostWhereInput = {
    removed: false,
  };

  if (type === "user") {
    if (id === null) {
      where.communityId = {
        in: communitiesAsMemberIds,
      };
    } else {
      where.authorId = id;
    }
  } else {
    if (id === null) {
    } else {
      where.community = {
        name: id,
      };
    }
  }

  const orderBy: Prisma.PostOrderByWithRelationInput =
    orderByType === "new"
      ? {
          createdAt: "desc",
        }
      : {
          score: "desc",
        };

  const posts = await prisma.post.findMany({
    where,
    orderBy,
    include: {
      author: true,
      community: true,
      _count: {
        select: {
          comment: true,
        },
      },
    },
    skip,
    cursor,
    take,
  });

  const results = await Promise.all(
    posts.map(async (post) => {
      const userVote = await prisma.vote.findUnique({
        where: {
          userId_targetType_targetId: {
            userId: user.id,
            targetType: "POST",
            targetId: post.id,
          },
        },
      });

      return {
        ...post,
        userScore: (userVote?.value as Score) || 0,
      };
    }),
  );

  return results;
}
