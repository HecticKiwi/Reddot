import CommunitySidebarView from "@/components/communitySidebar/communitySidebarView";
import { getCurrentUser } from "@/prisma/profile";
import { getPosts } from "@/actions/community";
import SortTabs from "@/components/sortTabs";
import Posts, { OrderBy } from "../[communityId]/_components/posts";

const MainPage = async ({
  searchParams,
}: {
  searchParams: { sort: OrderBy };
}) => {
  const profile = await getCurrentUser();

  const orderBy =
    searchParams.sort === "new" || searchParams.sort === "top"
      ? searchParams.sort
      : "new";

  const initialPosts = await getPosts({
    type: "community",
    id: null,
    orderBy,
  });

  return (
    <>
      <main className="mx-auto max-w-screen-lg p-8">
        <div className="grid grid-cols-[1fr_auto] gap-8">
          <div>
            <SortTabs orderBy={orderBy} />

            <Posts
              user={profile}
              type="community"
              id={null}
              initialPosts={initialPosts}
              orderBy={orderBy}
              className="flex-grow"
            />
          </div>

          <CommunitySidebarView
            header={"All Posts"}
            description="Posts from all corners of Reddot. Come here to see new posts rising and be a part of the conversation."
          />
        </div>
      </main>
    </>
  );
};

export default MainPage;
