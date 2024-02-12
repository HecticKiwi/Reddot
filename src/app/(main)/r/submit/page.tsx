import CommunityForm from "./_components/communityForm";
import { redirect } from "next/navigation";
import { communitySchemaType } from "@/schemas/community";
import { toast } from "@/components/ui/use-toast";
import { getCurrentUser } from "@/server/profile";
import { getCommunityById } from "@/server/community";
import { Long_Cang } from "next/font/google";

export default async function CommunityFormPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const communityId = searchParams.communityId as string;

  const profile = await getCurrentUser();

  if (communityId) {
    const community = await getCommunityById(communityId);

    if (!community) {
      toast({
        title: "No community",
      });
      redirect("/");
    }

    if (
      !community.moderators.some((moderator) => moderator.userId === profile.id)
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
