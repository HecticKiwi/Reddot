"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Comment from "./comment";
import { getCommentsForPostAction } from "@/actions/comment";

const CommentsClient = ({
  postId,
  initialComments,
}: {
  postId: string;
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

  return (
    <>
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </>
  );
};

export default CommentsClient;
