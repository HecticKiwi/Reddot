import { getPosts } from "@/actions/community";
import CommunitySidebarView from "@/components/communitySidebar/communitySidebarView";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentProfile } from "@/prisma/profile";
import Link from "next/link";
import Posts, { OrderBy } from "./community/[communityId]/_components/posts";
import SortTabs from "@/components/sortTabs";

const MainPage = async ({
  searchParams,
}: {
  searchParams: { sort: OrderBy };
}) => {
  const profile = await getCurrentProfile();

  const orderBy =
    searchParams.sort === "new" || searchParams.sort === "top"
      ? searchParams.sort
      : "new";

  const initialPosts = await getPosts({
    type: "profile",
    id: null,
    orderBy,
  });

  return (
    <>
      <main className="mx-auto max-w-screen-lg px-2 py-8 sm:px-8">
        <CommunitySidebarView
          header={`Hello, ${profile.username}.`}
          description="The home page has posts from all your joined communities."
          className="mb-8 w-full md:hidden"
        />

        <div className="flex gap-8">
          <div className="flex-grow">
            <SortTabs orderBy={orderBy} />

            <Posts
              profile={profile}
              type="profile"
              id={null}
              initialPosts={initialPosts}
              orderBy={orderBy}
            />
          </div>

          <CommunitySidebarView
            header={`Hello, ${profile.username}.`}
            description="The home page has posts from all your joined communities."
            className="hidden md:block"
          />
        </div>
      </main>
    </>
  );
};

export default MainPage;
