"use server";

import { db } from "@/lib/drizzle";
import { getCurrentUserOrThrow } from "@/features/user/utils";
import { and, eq, isNull, sql } from "drizzle-orm";
import {
  commentTable,
  postTable,
  userTable,
  voteTable,
} from "../../../drizzle/schema";

export async function voteOnPostOrComment({
  postId,
  commentId,
  authorId,
  score,
}: {
  postId: number | null;
  commentId: number | null;
  authorId: string;
  score: 1 | 0 | -1;
}) {
  const user = await getCurrentUserOrThrow();

  const existingVote = await db.query.voteTable.findFirst({
    where: and(
      eq(voteTable.userId, user.id),
      postId ? eq(voteTable.postId, postId) : isNull(voteTable.postId),
      commentId
        ? eq(voteTable.commentId, commentId)
        : isNull(voteTable.commentId),
    ),
  });

  const scoreChange = existingVote ? score - existingVote.value : score;

  await db.transaction(async (tx) => {
    // Update post/comment score
    if (commentId) {
      await tx
        .update(commentTable)
        .set({
          score: sql`${commentTable.score} + ${scoreChange}`,
        })
        .where(eq(commentTable.id, commentId));
    } else if (postId) {
      await tx
        .update(postTable)
        .set({
          score: sql`${postTable.score} + ${scoreChange}`,
        })
        .where(eq(postTable.id, postId))
        .returning();
    }

    // Update author's score
    await tx
      .update(userTable)
      .set({
        score: sql`${userTable.score} + ${scoreChange}`,
      })
      .where(eq(userTable.username, authorId));

    // Upsert vote
    await tx
      .insert(voteTable)
      .values({
        userId: user.id,
        postId,
        commentId,
        value: score,
      })
      .onConflictDoUpdate({
        target: [voteTable.userId, voteTable.postId, voteTable.commentId],
        set: {
          value: score,
        },
      });
  });

  return authorId;
}
