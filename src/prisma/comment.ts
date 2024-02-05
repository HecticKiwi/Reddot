import { PopulatedComment } from "@/actions/comment";
import { Score } from "@/actions/post";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "./profile";

export async function getCommentsForPost({ postId }: { postId: string }) {
  const profile = await getCurrentUser();

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
          userId_targetType_targetId: {
            userId: profile.id,
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

  const commentDictionary: { [k: string]: PopulatedComment } = {};

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
