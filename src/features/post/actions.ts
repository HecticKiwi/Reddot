"use server";

import { postSchema, postSchemaType } from "@/features/post/schema";
import { getCurrentUserOrThrow } from "@/features/user/server";
import { db } from "@/lib/drizzle";
import { and, desc, eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import invariant from "tiny-invariant";
import { postTable, voteTable } from "../../../drizzle/schema";

export type Score = 1 | 0 | -1;

export async function createPost(data: postSchemaType) {
  postSchema.parse(data);

  const user = await getCurrentUserOrThrow();

  const post = await db.transaction(async (tx) => {
    const [post] = await tx
      .insert(postTable)
      .values({
        ...data,
        authorName: user.username,
        score: 1,
      })
      .returning();

    const vote = await tx.insert(voteTable).values({
      userId: user.id,
      postId: post.id,
      value: 1,
    });

    return post;
  });

  return { id: post.id, communityName: data.communityName };
}

export async function getPostById(id: number) {
  invariant(!isNaN(id), "Expected id to be a number");

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
  invariant(!isNaN(id), "Expected id to be a number");

  const user = await getCurrentUserOrThrow();

  const post = await db.query.postTable.findFirst({
    where: eq(postTable.authorName, user.username),
  });

  if (!post) {
    throw new Error("You can't delete a post that isn't your own!");
  }

  await db.delete(postTable).where(eq(postTable.id, id));
}

export async function getPosts({
  type,
  name,
  pageParam,
  orderBy: orderByType,
}: {
  type: "user" | "community";
  name: string | null;
  pageParam?: number;
  orderBy: "new" | "top";
}) {
  invariant(
    type === "user" || type === "community",
    "Expected type to be 'user' or 'community'",
  );
  invariant(
    typeof name === "string" || name === null,
    "Expected name to be string or null",
  );
  invariant(
    pageParam === undefined || !isNaN(pageParam),
    "Expected pageParam to be number",
  );
  invariant(
    orderByType === "new" || orderByType === "top",
    "Expected type to be 'user' or 'community'",
  );

  const user = await getCurrentUserOrThrow();

  const take = 10;

  const communitiesAsMemberIds = user.communitiesAsMember.map(
    (community) => community.community.name,
  );

  let where: any = eq(postTable.removed, false);

  if (type === "user") {
    if (name === null) {
      if (communitiesAsMemberIds.length > 0) {
        where = and(
          where,
          inArray(postTable.communityName, communitiesAsMemberIds),
        );
      } else {
        return [];
      }
    } else {
      where = and(where, eq(postTable.authorName, name));
    }
  } else {
    if (name === null) {
    } else {
      where = and(where, eq(postTable.communityName, name));
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
