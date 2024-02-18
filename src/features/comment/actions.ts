"use server";

import { getCommentsForPost } from "@/features/comment/utils";
import { db } from "@/lib/drizzle";
import { getCurrentUserOrThrow } from "@/features/user/utils";
import { commentTable, voteTable } from "../../../drizzle/schema";

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
  const profile = await getCurrentUserOrThrow();

  const comment = await db.transaction(async (tx) => {
    const [comment] = await tx
      .insert(commentTable)
      .values({
        authorName: profile.username,
        postId: postId,
        parentCommentId,
        score: 1,
        content,
      })
      .returning();

    const vote = await tx.insert(voteTable).values({
      userId: profile.id,
      commentId: comment.id,
      value: 1,
    });

    return comment;
  });

  return comment;
}
