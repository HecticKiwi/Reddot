"use server";

import prisma from "@/lib/prisma";
import { getCurrentProfile } from "@/prisma/profile";
import { postSchemaType } from "@/schemas/post";
import { Prisma } from "@prisma/client";

export type Score = 1 | 0 | -1;
export type PostWithUserScore = Prisma.PromiseReturnType<typeof getPostById>;

export async function createPost(data: postSchemaType) {
  const profile = await getCurrentProfile();

  const post = await prisma.post.create({
    data: {
      ...data,
      authorId: profile.id,
    },
  });

  return post.id;
}

export async function getPostById(id: number) {
  const profile = await getCurrentProfile();

  const postPromise = prisma.post.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      author: true,
      community: true,
      _count: {
        select: {
          comment: true,
        },
      },
    },
  });

  const userVotePromise = prisma.vote.findUnique({
    where: {
      profileId_targetType_targetId: {
        profileId: profile.id,
        targetType: "POST",
        targetId: id,
      },
    },
  });

  const [post, userVote] = await Promise.all([postPromise, userVotePromise]);

  console.timeEnd("some");
  return {
    ...post,
    userScore: (userVote?.value as Score) || 0,
  };
}

export async function markPostAsRemoved(id: number) {
  const profile = await getCurrentProfile();

  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const isModerating = profile.communitiesAsModerator.some(
    (community) => community.id === post.communityId,
  );

  if (!isModerating) {
    throw new Error("You're not a mod!");
  }

  await prisma.post.update({
    where: {
      id,
    },
    data: {
      removed: !post.removed,
    },
  });

  return !post.removed;
}

export async function deletePost(id: number) {
  const post = await prisma.post.delete({
    where: {
      id,
    },
  });

  return post;
}
