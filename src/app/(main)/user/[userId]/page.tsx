import UserCard from "@/components/userCard";
import { getProfile } from "@/prisma/profile";
import { redirect } from "next/navigation";
import Posts, {
  OrderBy,
} from "../../community/[communityId]/_components/posts";
import { getPosts } from "@/actions/community";
import SortTabs from "@/components/sortTabs";

const UserIdPage = async ({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams: { sort: OrderBy };
}) => {
  console.time("user");
  const profile = await getProfile(Number(params.userId));

  if (!profile) {
    redirect("/");
  }

  const orderBy =
    searchParams.sort === "new" || searchParams.sort === "top"
      ? searchParams.sort
      : "new";

  const initialPosts = await getPosts({
    type: "profile",
    id: null,
    orderBy,
  });

  console.timeEnd("user");

  return (
    <>
      <main className="mx-auto max-w-screen-lg p-2 sm:p-8">
        <UserCard profile={profile} className="mb-8 w-full md:hidden" />

        <div className="flex gap-8">
          <div className="flex-grow">
            <SortTabs orderBy={orderBy} />
            <Posts
              profile={profile}
              type="profile"
              initialPosts={initialPosts}
              orderBy={orderBy}
              id={Number(params.userId)}
            />
          </div>
          <UserCard profile={profile} className="hidden md:block" />
        </div>
      </main>
    </>
  );
};

export default UserIdPage;
