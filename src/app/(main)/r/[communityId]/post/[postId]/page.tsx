import { getPostById } from "@/features/post/actions";
import PostCard from "@/features/post/components/postCard";
import { Separator } from "@/components/ui/separator";
import { getCurrentUserOrThrow } from "@/features/user/server";
import CommentForm from "./_components/commentForm";
import CommunitySidebar from "@/features/community/components/communitySidebar/communitySidebar";
import Comments from "@/features/comment/components/comments";
import invariant from "tiny-invariant";

export default async function PostPage({
  params,
}: {
  params: { postId: string };
}) {
  const postId = Number(params.postId);
  invariant(!isNaN(postId), "Expected postId to be a number");

  const profilePromise = getCurrentUserOrThrow();
  const postPromise = getPostById(postId);
  const [profile, post] = await Promise.all([profilePromise, postPromise]);

  return (
    <div className="mx-auto my-8 flex max-w-screen-lg gap-6 p-4">
      <div className="flex-grow">
        <PostCard
          profile={profile}
          postId={Number(postId)}
          initialPost={post}
        />

        <CommentForm postId={Number(postId)} className="mt-8" />

        <Separator className="my-8" />

        <Comments postId={Number(postId)} />
      </div>

      <CommunitySidebar
        communityName={post.community.name}
        inPost
        className="hidden md:block"
      />
    </div>
  );
}
