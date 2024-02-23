import "server-only";

import { Score } from "@/features/post/actions";
import { db } from "@/lib/drizzle";
import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { commentTable, postTable, voteTable } from "../../../drizzle/schema";
import { getCurrentUserOrThrow } from "../user/server";

export async function getCommentsForPost({ postId }: { postId: number }) {
  const user = await getCurrentUserOrThrow();

  const post = await db.query.postTable.findFirst({
    where: eq(postTable.id, postId),
    with: {
      comments: {
        orderBy: desc(commentTable.createdAt),
        with: {
          author: true,
          votes: {
            where: eq(voteTable.userId, user.id),
          },
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const comments = post.comments;

  const parsedComments = comments.map((comment) => ({
    ...comment,
    userScore: (comment.votes[0]?.value || 0) as Score,
    fromPostAuthor: comment.authorName === post.authorName,
  }));

  return parsedComments;
}
