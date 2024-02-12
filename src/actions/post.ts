"use server";

import { db } from "@/lib/drizzle";
import { getCurrentUser } from "@/server/profile";
import { postSchemaType } from "@/schemas/post";
import { postTable, voteTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export type Score = 1 | 0 | -1;

export async function createPost(data: postSchemaType) {
  const profile = await getCurrentUser();

  const [post] = await db
    .insert(postTable)
    .values({
      ...data,
      authorName: profile.username,
      score: 1,
    })
    .returning();

  const vote = await db.insert(voteTable).values({
    userId: profile.id,
    postId: post.id,
    value: 1,
  });

  return { id: post.id, communityName: data.communityName };
}

export async function getPostById(id: number) {
  const user = await getCurrentUser();

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
