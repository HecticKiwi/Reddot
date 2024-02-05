import { getCommentsForPost } from "@/prisma/comment";
import Comment from "./comment";
import CommentsClient from "./commentsClient";

const Comments = async ({ postId }: { postId: string }) => {
  const comments = await getCommentsForPost({ postId });

  return <CommentsClient postId={postId} initialComments={comments} />;
};

export default Comments;
