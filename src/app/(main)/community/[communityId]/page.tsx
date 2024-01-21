import CircleImage from "@/components/circleImage";
import CommunitySidebar from "@/components/communitySidebar/communitySidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Posts from "./_components/posts";
import JoinButton from "./_components/joinButton";
import { getCurrentProfile } from "@/prisma/profile";
import { getCommunityById } from "@/prisma/community";

export default async function CommunityPage({
  params,
}: {
  params: { communityId: string };
}) {
  const profile = await getCurrentProfile();
  const community = await getCommunityById(Number(params.communityId));

  if (!community) {
    throw new Error("Post not found.");
  }

  const isModerating = community.moderators.some(
    (moderator) => moderator.id === profile.id,
  );

  return (
    <main className="mx-auto max-w-screen-lg p-8">
      <div className="mb-12 flex items-center gap-4">
        <CircleImage
          src={community.imageUrl}
          alt={`${community.name} Image`}
          className="h-24 w-24"
        />
        <div>
          <div className="flex gap-6">
            <h1 className="text-3xl font-semibold">{community.name}</h1>
            <JoinButton profile={profile} communityId={community.id} />
          </div>
          <h2 className="text-sm text-muted-foreground">r/{community.name}</h2>
        </div>
        {isModerating && (
          <Button variant="outline" className="ml-auto" asChild>
            <Link href={`/community/submit?communityId=${community.id}`}>
              Edit
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-8">
        <Posts
          profile={profile}
          type="community"
          id={Number(params.communityId)}
          className="flex-grow"
        />

        <CommunitySidebar communityId={Number(params.communityId)} />
      </div>
    </main>
  );
}
