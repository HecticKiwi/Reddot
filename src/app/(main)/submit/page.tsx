import { Community } from "@prisma/client";
import PostForm from "./_components/postForm";
import CommunitySidebar from "@/components/communitySidebar/communitySidebar";
import { getCommunityById } from "@/prisma/community";
import { getCurrentUser } from "@/prisma/profile";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const profile = await getCurrentUser();
  const communityId = searchParams?.communityId as string;
  let community: Community | null = null;

  if (searchParams?.communityId) {
    community = await getCommunityById(communityId);
  }

  return (
    <div className="mx-auto max-w-screen-lg p-8">
      <h1 className="text-2xl font-semibold tracking-tight">New Post</h1>

      <div className="mt-8 grid grid-cols-[1fr_auto] gap-4">
        <PostForm profile={profile} community={community} />
        {community && (
          <CommunitySidebar
            communityId={communityId}
            className="hidden md:block"
          />
        )}
      </div>
    </div>
  );
}
