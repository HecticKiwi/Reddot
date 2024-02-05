import UserCard from "@/components/userCard";
import { getProfile } from "@/prisma/profile";
import { redirect } from "next/navigation";
import Posts, { OrderBy } from "../../r/[communityId]/_components/posts";
import { getPosts } from "@/actions/community";
import SortTabs from "@/components/sortTabs";

const UserIdPage = async ({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams: { sort: OrderBy };
}) => {
  const profile = await getProfile(params.userId);

  if (!profile) {
    redirect("/");
  }

  const orderBy =
    searchParams.sort === "new" || searchParams.sort === "top"
      ? searchParams.sort
      : "new";

  const initialPosts = await getPosts({
    type: "user",
    id: null,
    orderBy,
  });

  return (
    <>
      <main className="mx-auto max-w-screen-lg px-2 py-8 sm:p-8">
        <UserCard profile={profile} className="mb-8 w-full md:hidden" />

        <div className="flex gap-8">
          <div className="flex-grow">
            <SortTabs orderBy={orderBy} />
            <Posts
              user={profile}
              type="user"
              initialPosts={initialPosts}
              orderBy={orderBy}
              id={params.userId}
            />
          </div>
          <UserCard profile={profile} className="hidden md:block" />
        </div>
      </main>
    </>
  );
};

export default UserIdPage;
