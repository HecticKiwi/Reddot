import CommunitySidebarView from "@/components/communitySidebar/communitySidebarView";
import Posts from "../community/[communityId]/_components/posts";
import { getCurrentProfile } from "@/prisma/profile";

const MainPage = async () => {
  const profile = await getCurrentProfile();

  return (
    <>
      <main className="mx-auto max-w-screen-lg p-8">
        <div className="grid grid-cols-[1fr_auto] gap-8">
          <Posts
            profile={profile}
            type="community"
            id={null}
            className="flex-grow"
          />

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
