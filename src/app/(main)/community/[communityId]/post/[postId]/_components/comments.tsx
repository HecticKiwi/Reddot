import { getCommentsForPost } from "@/prisma/comment";
import Comment from "./comment";
import CommentsClient from "./commentsClient";

const Comments = async ({ postId }: { postId: number }) => {
  const comments = await getCommentsForPost({ postId: Number(postId) });

  if (comments.length === 0) {
    return (
      <div className="text-center text-muted-foreground">No comments.</div>
    );
  }

  return <CommentsClient postId={postId} initialComments={comments} />;
};

export default Comments;
