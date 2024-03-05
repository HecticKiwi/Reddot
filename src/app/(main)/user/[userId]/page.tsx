import { getPosts } from "@/features/post/actions";
import SortTabs from "@/features/post/components/sortTabs";
import UserCard from "@/features/user/components/userCard";
import { getUser } from "@/features/user/server";
import { redirect } from "next/navigation";
import Posts, { OrderBy } from "../../../../features/post/components/posts";

const UserIdPage = async ({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams: { sort: OrderBy };
}) => {
  const profile = await getUser(params.userId);

  if (!profile) {
    redirect("/");
  }

  const orderBy =
    searchParams.sort === "new" || searchParams.sort === "top"
      ? searchParams.sort
      : "new";

  const initialPosts = await getPosts({
    type: "user",
    name: params.userId,
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
              name={params.userId}
            />
          </div>
          <UserCard profile={profile} className="hidden md:block" />
        </div>
      </main>
    </>
  );
};

export default UserIdPage;
