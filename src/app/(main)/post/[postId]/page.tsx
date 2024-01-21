import { getPostById } from "@/actions/post";
import CommunitySidebar from "@/components/communitySidebar/communitySidebar";
import PostCard from "@/components/postCard";
import { Separator } from "@/components/ui/separator";
import { getCurrentProfile } from "@/prisma/profile";
import CommentForm from "./_components/commentForm";
import Comments from "./_components/comments";

export default async function PostPage({
  params,
}: {
  params: { postId: string };
}) {
  const profile = await getCurrentProfile();
  const post = await getPostById(Number(params.postId));

  if (!post) {
    throw new Error("Post not found.");
  }

  return (
    <div className="mx-auto my-8 grid max-w-screen-lg grid-cols-[1fr_auto] gap-6 p-4">
      <div>
        {/* Post */}
        <PostCard profile={profile} post={post} />

        {/* Comment */}
        <CommentForm postId={post.id} className="mt-8" />

        <Separator className="my-8" />

        {/* Other comments */}
        <Comments postId={post.id} />
      </div>

      <CommunitySidebar communityId={post.communityId} inPost />
    </div>
  );
}
