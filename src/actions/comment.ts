"use server";

import { getCommentsForPost } from "@/server/comment";
import { getCurrentUser } from "@/server/profile";
import { Score } from "./post";
import { db } from "@/lib/drizzle";
import { commentTable } from "../../drizzle/schema";

export async function getCommentsForPostAction({ postId }: { postId: number }) {
  return await getCommentsForPost({ postId });
}

export async function commentOnPost({
  postId,
  parentCommentId,
  content,
}: {
  postId: number;
  parentCommentId?: number;
  content: string;
}) {
  const profile = await getCurrentUser();

  const comment = await db
    .insert(commentTable)
    .values({
      authorName: profile.username,
      postId: postId,
      parentCommentId,
      content,
    })
    .returning();

  return comment;
}
