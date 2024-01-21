import UserCard from "@/components/userCard";
import { getProfile } from "@/prisma/profile";
import { redirect } from "next/navigation";
import Posts from "../../community/[communityId]/_components/posts";

const UserIdPage = async ({ params }: { params: { userId: string } }) => {
  const profile = await getProfile(Number(params.userId));

  if (!profile) {
    redirect("/");
  }

  return (
    <>
      <div className="mx-auto grid max-w-screen-lg grid-cols-[1fr_auto] gap-4 p-8">
        <Posts profile={profile} type="profile" id={Number(params.userId)} />
        <UserCard profile={profile} />
      </div>
    </>
  );
};

export default UserIdPage;
