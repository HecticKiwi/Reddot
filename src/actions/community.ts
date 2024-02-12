"use server";

import { db } from "@/lib/drizzle";
import { getCurrentUser } from "@/server/profile";
import { communityDto } from "@/schemas/community";
import { and, desc, eq, gt, ilike, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  communityMods,
  communityTable,
  communityToUser,
  postTable,
  voteTable,
} from "../../drizzle/schema";

export async function isCommunityNameAvailable(name: string) {
  const community = await db.query.communityTable.findFirst({
    where: eq(communityTable.name, name),
  });

  return !community;
}

export async function createCommunity(data: communityDto) {
  const profile = await getCurrentUser();

  const [community] = await db
    .insert(communityTable)
    .values({
      ...data,
    })
    .returning();

  await db.insert(communityMods).values({
    communityName: data.name,
    userId: profile.id,
  });

  await db.insert(communityToUser).values({
    communityName: data.name,
    userId: profile.id,
  });

  return community.name;
}

export async function searchCommunitiesByName(name: string) {
  if (!name) {
    return [];
  }

  return await db.query.communityTable.findMany({
    where: ilike(communityTable.name, `%${name}%`),
  });
}

export async function updateCommunity({
  communityId,
  data,
}: {
  communityId: string;
  data: Partial<communityDto>;
}) {
  const community = await db
    .update(communityTable)
    .set(data)
    .where(eq(communityTable.name, communityId));

  return community;
}

export async function joinOrLeaveCommunity({
  communityName,
}: {
  communityName: string;
}) {
  const profile = await getCurrentUser();

  const existingMembership = await db.query.communityToUser.findFirst({
    where: and(
      eq(communityToUser.userId, profile.id),
      eq(communityToUser.communityName, communityName),
    ),
  });

  if (existingMembership) {
    await db
      .delete(communityToUser)
      .where(
        and(
          eq(communityToUser.userId, profile.id),
          eq(communityToUser.communityName, communityName),
        ),
      );
  } else {
    await db.insert(communityToUser).values({
      userId: profile.id,
      communityName: communityName,
    });
  }

  revalidatePath("/");

  return !existingMembership;
}

export async function getPosts({
  type,
  name: id,
  pageParam,
  orderBy: orderByType,
}: {
  type: "user" | "community";
  name: string | null;
  pageParam?: number;
  orderBy: "new" | "top";
}) {
  const user = await getCurrentUser();

  const take = 5;

  const communitiesAsMemberIds = user.communitiesAsMember.map(
    (community) => community.community.name,
  );

  let where: any = eq(postTable.removed, false);

  if (pageParam) [(where = and(where, gt(postTable.id, pageParam)))];

  if (type === "user") {
    if (id === null) {
      if (communitiesAsMemberIds.length > 0) {
        where = and(
          where,
          inArray(postTable.communityName, communitiesAsMemberIds),
        );
      } else {
        return [];
      }
    } else {
      where = and(where, eq(postTable.authorName, id));
    }
  } else {
    if (id === null) {
    } else {
      where = and(where, eq(postTable.communityName, id));
    }
  }

  const orderBy =
    orderByType === "new"
      ? [desc(postTable.createdAt)]
      : [desc(postTable.score)];

  const posts = (
    await db.query.postTable.findMany({
      where,
      orderBy,
      with: {
        author: true,
        community: true,
        comments: {
          columns: {
            id: true,
          },
        },
        votes: {
          where: eq(voteTable.userId, user.id),
        },
      },
      limit: take,
    })
  ).map((post) => ({
    ...post,
    userScore: post.votes[0]?.value || 0,
  }));

  return posts;
}
