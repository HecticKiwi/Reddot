import CommunitySidebarView from "@/features/community/components/communitySidebar/communitySidebarView";
import { getPosts } from "@/features/post/actions";
import SortTabs from "@/features/post/components/sortTabs";
import { getCurrentUserOrThrow } from "@/features/user/server";
import Posts, { OrderBy } from "../../features/post/components/posts";

const MainPage = async ({
  searchParams,
}: {
  searchParams: { sort: OrderBy };
}) => {
  const user = await getCurrentUserOrThrow();

  const orderBy =
    searchParams.sort === "new" || searchParams.sort === "top"
      ? searchParams.sort
      : "new";

  const initialPosts = await getPosts({
    type: "user",
    name: null,
    orderBy,
  });

  return (
    <>
      <main className="mx-auto max-w-screen-lg px-2 py-8 sm:px-8">
        <CommunitySidebarView
          header={`Hello, ${user.username}.`}
          description="The home page has posts from all your joined communities."
          className="mb-8 w-full md:hidden"
        />

        <div className="flex gap-8">
          <div className="flex-grow">
            <SortTabs orderBy={orderBy} />

            <Posts
              user={user}
              type="user"
              id={null}
              initialPosts={initialPosts}
              orderBy={orderBy}
            />
          </div>

          <CommunitySidebarView
            header={`Hello, ${user.username}.`}
            description="The home page has posts from all your joined communities."
            className="hidden md:block"
          />
        </div>
      </main>
    </>
  );
};

export default MainPage;
