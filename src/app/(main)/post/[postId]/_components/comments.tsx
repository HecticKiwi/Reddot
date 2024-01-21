import { getCommentsForPost } from "@/prisma/comment";
import Comment from "./comment";

const Comments = async ({ postId }: { postId: number }) => {
  const comments = await getCommentsForPost({ postId: Number(postId) });

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

export default Comments;
