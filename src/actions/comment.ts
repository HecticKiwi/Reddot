"use server";

import prisma from "@/lib/prisma";
import { Prisma, Profile } from "@prisma/client";
import { Score } from "./post";
import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/prisma/profile";

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

export async function getCommentsForPost({ postId }: { postId: number }) {
  const profile = await getCurrentProfile();

  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
  });

  const parsedComments = await Promise.all(
    comments.map(async (comment) => {
      const userVote = await prisma.vote.findUnique({
        where: {
          profileId_targetType_targetId: {
            profileId: profile.id,
            targetType: "COMMENT",
            targetId: comment.id,
          },
        },
      });

      return {
        ...comment,
        userScore: (userVote?.value || 0) as Score,
      };
    }),
  );

  const mappedComments: PopulatedComment[] = parsedComments.map((comment) => ({
    ...comment,
    childComments: [],
    fromPostAuthor: comment.authorId === post.authorId,
  }));

  const commentDictionary: { [k: number]: PopulatedComment } = {};

  for (const comment of mappedComments) {
    commentDictionary[comment.id] = comment;
  }

  for (const comment of mappedComments) {
    if (comment.parentCommentId) {
      commentDictionary[comment.parentCommentId].childComments.push(comment);
    }
  }

  const rootComments = mappedComments.filter(
    (comment) => comment.parentCommentId === null,
  );

  return rootComments;
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
  const profile = await getCurrentProfile();

  const comment = await prisma.comment.create({
    data: {
      authorId: profile.id,
      postId,
      parentCommentId,
      content,
    },
  });

  revalidatePath("/");

  return comment;
}
