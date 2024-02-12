"use server";

import { db } from "@/lib/drizzle";
import { getCurrentUser } from "@/server/profile";
import { and, eq, isNull, sql } from "drizzle-orm";
import {
  commentTable,
  postTable,
  userTable,
  voteTable,
} from "../../drizzle/schema";

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
  const user = await getCurrentUser();

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

  let postCommentPromise;

  // Update post/comment score
  if (commentId) {
    postCommentPromise = db
      .update(commentTable)
      .set({
        score: sql`${commentTable.score} + ${scoreChange}`,
      })
      .where(eq(commentTable.id, commentId));
  } else if (postId) {
    postCommentPromise = await db
      .update(postTable)
      .set({
        score: sql`${postTable.score} + ${scoreChange}`,
      })
      .where(eq(postTable.id, postId))
      .returning();
  }

  // Update author's score
  const authorPromise = db
    .update(userTable)
    .set({
      score: sql`${userTable.score} + ${scoreChange}`,
    })
    .where(eq(userTable.username, authorId));

  // Upsert
  const votePromise = db
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

  await Promise.all([postCommentPromise, authorPromise, votePromise]);

  return authorId;
}
