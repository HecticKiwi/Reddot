"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/prisma/profile";
import { postSchemaType } from "@/schemas/post";
import { Prisma } from "@prisma/client";

export type Score = 1 | 0 | -1;
export type PostWithUserScore = Prisma.PromiseReturnType<typeof getPostById>;

export async function createPost(data: postSchemaType) {
  const profile = await getCurrentUser();

  const post = await prisma.post.create({
    data: {
      ...data,
      authorId: profile.id,
      score: 1,
    },
    include: {
      community: true,
    },
  });

  await prisma.vote.create({
    data: {
      targetType: "POST",
      targetId: post.id,
      value: 1,
      user: {
        connect: {
          id: profile.id,
        },
      },
    },
  });

  return { id: post.id, communityName: post.community.name };
}

export async function getPostById(id: string) {
  const user = await getCurrentUser();

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
      userId_targetType_targetId: {
        userId: user.id,
        targetType: "POST",
        targetId: id,
      },
    },
  });

  const [post, userVote] = await Promise.all([postPromise, userVotePromise]);

  return {
    ...post,
    userScore: (userVote?.value as Score) || 0,
  };
}

export async function deletePost(id: string) {
  const post = await prisma.post.delete({
    where: {
      id,
    },
    include: {
      community: true,
    },
  });

  return post.community.name;
}
