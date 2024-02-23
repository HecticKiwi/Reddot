"use server";

import { getCommentsForPost } from "@/features/comment/server";
import { db } from "@/lib/drizzle";
import { getCurrentUserOrThrow } from "@/features/user/server";
import { commentTable, voteTable } from "../../../drizzle/schema";
import invariant from "tiny-invariant";

export async function getCommentsForPostAction({ postId }: { postId: number }) {
  invariant(!isNaN(postId), "Expected postId to be a number");

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
  invariant(!isNaN(postId), "Expected postId to be a number");
  invariant(!isNaN(postId), "Expected parentCommentId to be a number");
  invariant(typeof content === "string", "Expected content to be a string");

  const user = await getCurrentUserOrThrow();

  const comment = await db.transaction(async (tx) => {
    const [comment] = await tx
      .insert(commentTable)
      .values({
        authorName: user.username,
        postId: postId,
        parentCommentId,
        score: 1,
        content,
      })
      .returning();

    const vote = await tx.insert(voteTable).values({
      userId: user.id,
      commentId: comment.id,
      value: 1,
    });

    return comment;
  });

  return comment;
}
