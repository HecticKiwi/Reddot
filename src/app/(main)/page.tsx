import CommunitySidebarView from "@/components/communitySidebar/communitySidebarView";
import { getCurrentProfile } from "@/prisma/profile";
import Posts from "./community/[communityId]/_components/posts";

const MainPage = async () => {
  const profile = await getCurrentProfile();

  return (
    <>
      <main className="mx-auto max-w-screen-lg p-8">
        <div className="grid grid-cols-[1fr_auto] gap-8">
          <Posts
            profile={profile}
            type="profile"
            id={null}
            className="flex-grow"
          />

          <CommunitySidebarView
            header={`Hello, ${profile.username}.`}
            description="The home page has posts from all your joined communities."
          />
        </div>
      </main>
    </>
  );
};

export default MainPage;
