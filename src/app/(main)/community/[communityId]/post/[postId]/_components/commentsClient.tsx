"use client";

import { getCommentsForPost } from "@/actions/comment";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Comment from "./comment";

const CommentsClient = ({
  postId,
  initialComments,
}: {
  postId: number;
  initialComments: Awaited<ReturnType<typeof getCommentsForPost>>;
}) => {
  const { data: comments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsForPost({ postId }),
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
