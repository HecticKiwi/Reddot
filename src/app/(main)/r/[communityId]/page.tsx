import { getPosts } from "@/actions/community";
import CircleImage from "@/components/circleImage";
import CommunitySidebar from "@/components/communitySidebar/communitySidebar";
import SortTabs from "@/components/sortTabs";
import { Button } from "@/components/ui/button";
import { getCommunityById } from "@/prisma/community";
import { getCurrentUser } from "@/prisma/profile";
import Link from "next/link";
import JoinButton from "./_components/joinButton";
import Posts, { OrderBy } from "./_components/posts";
import { notFound } from "next/navigation";

export default async function CommunityPage({
  params,
  searchParams,
}: {
  params: { communityId: string };
  searchParams: { sort: OrderBy };
}) {
  const profilePromise = getCurrentUser();

  const communityPromise = getCommunityById(params.communityId);

  const orderBy =
    searchParams.sort === "new" || searchParams.sort === "top"
      ? searchParams.sort
      : "new";

  const initialPostsPromise = getPosts({
    type: "community",
    id: params.communityId,
    orderBy,
  });

  const [user, community, initialPosts] = await Promise.all([
    profilePromise,
    communityPromise,
    initialPostsPromise,
  ]);

  if (!community) {
    notFound();
  }

  const isModerating = community.moderators.some(
    (moderator) => moderator.id === user.id,
  );

  return (
    <main className="mx-auto max-w-screen-lg px-2 py-8 sm:p-8">
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
            <JoinButton profile={user} communityId={community.id} />

            {isModerating && (
              <Button size={"sm"} className="h-auto gap-1 px-2 py-1 text-xs">
                <Link href={`/r/submit?communityId=${community.name}`}>
                  Edit
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <CommunitySidebar
        communityId={params.communityId}
        className="my-6 w-full  md:hidden"
      />

      <div className="mt-10 flex gap-8">
        <div className="flex-grow">
          <SortTabs orderBy={orderBy} />
          <Posts
            user={user}
            type="community"
            id={params.communityId}
            initialPosts={initialPosts}
            orderBy={orderBy}
          />
        </div>

        <CommunitySidebar
          communityId={params.communityId}
          className="hidden md:block"
        />
      </div>
    </main>
  );
}
