import CommunityForm from "./_components/communityForm";
import { redirect } from "next/navigation";
import { Community } from "@prisma/client";
import { communitySchemaType } from "@/schemas/community";
import { toast } from "@/components/ui/use-toast";
import { getCurrentProfile } from "@/prisma/profile";
import { getCommunityById } from "@/prisma/community";
import { Long_Cang } from "next/font/google";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const communityId = searchParams.communityId as string;

  const profile = await getCurrentProfile();

  if (communityId) {
    const community = await getCommunityById(Number(communityId));

    if (!community) {
      toast({
        title: "No community",
      });
      redirect("/");
    }

    if (
      !community.moderators.some((moderator) => moderator.id === profile.id)
    ) {
      toast({
        title: "You're not a mod",
      });
      redirect("/");
    }

    return (
      <main>
        <CommunityForm key={community.id} community={community} />
      </main>
    );
  }

  return (
    <main>
      <CommunityForm key="newCommunity" />
    </main>
  );
}
