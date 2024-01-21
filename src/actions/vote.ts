"use server";

import prisma from "@/lib/prisma";
import { getCurrentProfile } from "@/prisma/profile";
import { Prisma, Vote, VoteTarget } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function voteOnPostOrComment({
  targetType,
  targetId,
  score,
}: {
  targetType: VoteTarget;
  targetId: number;
  score: 1 | 0 | -1;
}) {
  const profile = await getCurrentProfile();

  const profileId_targetType_targetId = {
    profileId: profile.id,
    targetType,
    targetId,
  };

  let vote: Vote | null = null;

  const existingVote = await prisma.vote.findUnique({
    where: {
      profileId_targetType_targetId,
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

  let authorId: number = 0;

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
  await prisma.profile.update({
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
        profileId_targetType_targetId,
      },
      update: {
        value: score,
      },
      create: {
        profileId: profile.id,
        targetType,
        targetId,
        value: score,
      },
    });
  } else {
    // Remove vote
    await prisma.vote.delete({
      where: {
        profileId_targetType_targetId,
      },
    });
  }

  revalidatePath("/");

  return authorId;
}
