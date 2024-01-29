import { getPosts } from "@/actions/community";
import CircleImage from "@/components/circleImage";
import CommunitySidebar from "@/components/communitySidebar/communitySidebar";
import { Button } from "@/components/ui/button";
import { getCommunityById } from "@/prisma/community";
import { getCurrentProfile } from "@/prisma/profile";
import Link from "next/link";
import JoinButton from "./_components/joinButton";
import Posts, { OrderBy } from "./_components/posts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SortTabs from "@/components/sortTabs";

export default async function CommunityPage({
  params,
  searchParams,
}: {
  params: { communityId: string };
  searchParams: { sort: OrderBy };
}) {
  const profile = await getCurrentProfile();
  const community = await getCommunityById(Number(params.communityId));

  if (!community) {
    throw new Error("Post not found.");
  }

  const isModerating = community.moderators.some(
    (moderator) => moderator.id === profile.id,
  );

  const orderBy =
    searchParams.sort === "new" || searchParams.sort === "top"
      ? searchParams.sort
      : "new";

  const initialPosts = await getPosts({
    type: "community",
    id: Number(params.communityId),
    orderBy,
  });

  return (
    <main className="mx-auto max-w-screen-lg p-2 sm:p-8">
      <div className="mb-2 flex items-center gap-4">
        <CircleImage
          src={community.imageUrl}
          alt={`${community.name} Image`}
          className="h-24 w-24"
        />
        <div>
          <div className="flex gap-6">
            <h1 className="text-3xl font-semibold">{community.name}</h1>
          </div>
          <h2 className="text-sm text-muted-foreground">r/{community.name}</h2>

          {/* Buttons */}
          <div className="mt-2 flex gap-4">
            <JoinButton profile={profile} communityId={community.id} />

            {isModerating && (
              <Button
                // variant={"destructive"}
                size={"sm"}
                className="h-auto gap-1 p-1 text-xs"
              >
                <Link href={`/community/submit?communityId=${community.id}`}>
                  Edit
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <CommunitySidebar
        communityId={Number(params.communityId)}
        className="my-6 w-full  md:hidden"
      />

      <div className="mt-10 flex gap-8">
        <div className="flex-grow">
          <SortTabs orderBy={orderBy} />
          <Posts
            profile={profile}
            type="community"
            id={Number(params.communityId)}
            initialPosts={initialPosts}
            orderBy={orderBy}
          />
        </div>

        <CommunitySidebar
          communityId={Number(params.communityId)}
          className="hidden md:block"
        />
      </div>
    </main>
  );
}
