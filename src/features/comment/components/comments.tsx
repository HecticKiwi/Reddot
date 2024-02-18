import { getCommentsForPost } from "@/features/comment/utils";
import CommentsClient from "./commentsClient";

const Comments = async ({ postId }: { postId: number }) => {
  const comments = await getCommentsForPost({ postId });

  return <CommentsClient postId={postId} initialComments={comments} />;
};

export default Comments;
