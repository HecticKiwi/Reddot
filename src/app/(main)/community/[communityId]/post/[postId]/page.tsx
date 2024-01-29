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

  const postId = Number(params.postId);

  const post = await getPostById(postId);

  return (
    <div className="mx-auto my-8 flex max-w-screen-lg gap-6 p-4">
      <div className="flex-grow">
        {/* Post */}
        <PostCard profile={profile} postId={postId} />

        {/* Comment */}
        <CommentForm postId={postId} className="mt-8" />

        <Separator className="my-8" />

        {/* Other comments */}
        <Comments postId={postId} />
      </div>

      <CommunitySidebar
        communityId={post.communityId}
        inPost
        className="hidden md:block"
      />
    </div>
  );
}
