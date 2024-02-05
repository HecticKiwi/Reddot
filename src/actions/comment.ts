"use server";

import prisma from "@/lib/prisma";
import { getCommentsForPost } from "@/prisma/comment";
import { getCurrentUser } from "@/prisma/profile";
import { Prisma } from "@prisma/client";
import { Score } from "./post";

const commentWithAuthor = Prisma.validator<Prisma.CommentDefaultArgs>()({
  include: {
    author: true,
  },
});

export type CommentWithAuthor = Prisma.CommentGetPayload<
  typeof commentWithAuthor
>;

export type PopulatedComment = CommentWithAuthor & {
  childComments: PopulatedComment[];
  userScore: Score;
  fromPostAuthor: boolean;
};

export async function getCommentsForPostAction({ postId }: { postId: string }) {
  return await getCommentsForPost({ postId });
}

export async function commentOnPost({
  postId,
  parentCommentId,
  content,
}: {
  postId: string;
  parentCommentId?: string;
  content: string;
}) {
  const profile = await getCurrentUser();

  const comment = await prisma.comment.create({
    data: {
      authorId: profile.id,
      postId,
      parentCommentId,
      content,
    },
  });

  return comment;
}
