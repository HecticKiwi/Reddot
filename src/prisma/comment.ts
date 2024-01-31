import prisma from "@/lib/prisma";
import { Prisma, Profile } from "@prisma/client";
import { getCurrentProfile } from "./profile";
import { Score } from "@/actions/post";
import { PopulatedComment } from "@/actions/comment";

export async function getCommentsForPost({ postId }: { postId: number }) {
  console.time("comments");

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
  console.timeEnd("comments");

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
