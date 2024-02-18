"use server";

import { db } from "@/lib/drizzle";
import { getCurrentUserOrThrow } from "@/features/user/utils";
import { postSchemaType } from "@/features/post/schema";
import { postTable, voteTable } from "../../../drizzle/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";

export type Score = 1 | 0 | -1;

export async function createPost(data: postSchemaType) {
  const profile = await getCurrentUserOrThrow();

  const post = await db.transaction(async (tx) => {
    const [post] = await tx
      .insert(postTable)
      .values({
        ...data,
        authorName: profile.username,
        score: 1,
      })
      .returning();

    const vote = await tx.insert(voteTable).values({
      userId: profile.id,
      postId: post.id,
      value: 1,
    });

    return post;
  });

  return { id: post.id, communityName: data.communityName };
}

export async function getPostById(id: number) {
  const user = await getCurrentUserOrThrow();

  const post = await db.query.postTable.findFirst({
    where: eq(postTable.id, id),
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
  });

  if (!post) {
    notFound();
  }

  return {
    ...post,
    userScore: (post.votes[0]?.value as Score) || 0,
  };
}

export async function deletePost(id: number) {
  await db.delete(postTable).where(eq(postTable.id, id));
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
  const user = await getCurrentUserOrThrow();

  const take = 10;

  const communitiesAsMemberIds = user.communitiesAsMember.map(
    (community) => community.community.name,
  );

  let where: any = eq(postTable.removed, false);

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
      : [desc(postTable.score), desc(postTable.createdAt)];

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
      offset: pageParam ? pageParam * take : undefined,
    })
  ).map((post) => ({
    ...post,
    userScore: post.votes[0]?.value || 0,
  }));

  return posts;
}
