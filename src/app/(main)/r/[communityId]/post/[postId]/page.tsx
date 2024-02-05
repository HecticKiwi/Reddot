import { getPostById } from "@/actions/post";
import CommunitySidebar from "@/components/communitySidebar/communitySidebar";
import PostCard from "@/components/postCard";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/prisma/profile";
import CommentForm from "./_components/commentForm";
import Comments from "./_components/comments";
import { PostponedPathnameNormalizer } from "next/dist/server/future/normalizers/request/postponed";

export default async function PostPage({
  params,
}: {
  params: { postId: string };
}) {
  const profilePromise = getCurrentUser();

  const { postId } = params;

  const postPromise = getPostById(postId);

  const [profile, post] = await Promise.all([profilePromise, postPromise]);

  return (
    <div className="mx-auto my-8 flex max-w-screen-lg gap-6 p-4">
      <div className="flex-grow">
        {/* Post */}
        <PostCard profile={profile} postId={postId} initialPost={post} />

        {/* Comment */}
        <CommentForm postId={postId} className="mt-8" />

        <Separator className="my-8" />

        {/* Other comments */}
        <Comments postId={postId} />
      </div>

      <CommunitySidebar
        communityId={post.community.name}
        inPost
        className="hidden md:block"
      />
    </div>
  );
}
