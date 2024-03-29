import CommunitySidebarView from "@/features/community/components/communitySidebar/communitySidebarView";
import { getPosts } from "@/features/post/actions";
import SortTabs from "@/features/post/components/sortTabs";
import { getCurrentUserOrThrow } from "@/features/user/server";
import Posts, { OrderBy } from "../../../../features/post/components/posts";

const MainPage = async ({
  searchParams,
}: {
  searchParams: { sort: OrderBy };
}) => {
  const profile = await getCurrentUserOrThrow();

  const orderBy =
    searchParams.sort === "new" || searchParams.sort === "top"
      ? searchParams.sort
      : "new";

  const initialPosts = await getPosts({
    type: "community",
    name: null,
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
              name={null}
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
