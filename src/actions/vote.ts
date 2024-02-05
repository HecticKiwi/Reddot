"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/prisma/profile";
import { Prisma, Vote, VoteTarget } from "@prisma/client";

export async function voteOnPostOrComment({
  postId,
  commentId,
  score,
}: {
  postId: string;
  commentId?: string;
  score: 1 | 0 | -1;
}) {
  const user = await getCurrentUser();

  const targetType: VoteTarget = commentId ? "COMMENT" : "POST";
  const targetId = commentId ?? postId;

  const userId_targetType_targetId: Prisma.VoteUserIdTargetTypeTargetIdCompoundUniqueInput =
    {
      userId: user.id,
      targetType,
      targetId,
    };

  let vote: Vote | null = null;

  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_targetType_targetId,
    },
  });

  const scoreChange = existingVote ? score - existingVote.value : score;
  const updateConfig: Prisma.PostUpdateArgs | Prisma.CommentUpdateArgs = {
    where: {
      id: targetId,
    },
    data: {
      score: {
        increment: scoreChange,
      },
    },
    select: {
      authorId: true,
    },
  };

  let authorId: string = "";

  // Update post/comment score
  if (targetType === "POST") {
    const post = await prisma.post.update(
      updateConfig as Prisma.PostUpdateArgs,
    );
    authorId = post.authorId;
  } else if (targetType === "COMMENT") {
    const comment = await prisma.comment.update(
      updateConfig as Prisma.CommentUpdateArgs,
    );
    authorId = comment.authorId;
  }

  // Update author's score
  await prisma.user.update({
    where: {
      id: authorId,
    },
    data: {
      score: {
        increment: scoreChange,
      },
    },
  });

  // Upsert or delete the vote
  if (score !== 0) {
    // Vote
    vote = await prisma.vote.upsert({
      where: {
        userId_targetType_targetId,
      },
      update: {
        value: score,
      },
      create: {
        userId: user.id,
        targetType,
        targetId,
        value: score,
      },
    });
  } else {
    // Remove vote
    await prisma.vote.delete({
      where: {
        userId_targetType_targetId,
      },
    });
  }

  return authorId;
}
