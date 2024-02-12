"use client";

import { getCommentsForPostAction } from "@/actions/comment";
import { useQuery } from "@tanstack/react-query";
import Comment from "./comment";

const CommentsClient = ({
  postId,
  initialComments,
}: {
  postId: number;
  initialComments: Awaited<ReturnType<typeof getCommentsForPostAction>>;
}) => {
  const { data: comments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsForPostAction({ postId }),
    initialData: initialComments,
  });

  if (!comments) {
    return null;
  }

  if (comments.length === 0) {
    return (
      <div className="text-center text-muted-foreground">No comments.</div>
    );
  }

  // Format comments array into nested
  const commentsWithChildren = comments.map((comment) => ({
    ...comment,
    childComments: [],
  }));

  const commentDictionary: { [k: string]: any } = {};
  for (const comment of commentsWithChildren) {
    commentDictionary[comment.id] = comment;
  }

  for (const comment of commentsWithChildren) {
    if (comment.parentCommentId) {
      commentDictionary[comment.parentCommentId].childComments.push(comment);
    }
  }

  const rootComments = commentsWithChildren.filter(
    (comment) => comment.parentCommentId === null,
  );

  return (
    <>
      <div className="space-y-4">
        {rootComments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </>
  );
};

export default CommentsClient;
