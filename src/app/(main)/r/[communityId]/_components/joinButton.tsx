"use client";

import { Button } from "@/components/ui/button";
import { useJoinOrLeaveCommunity } from "@/hooks/community/useJoinOrLeaveCommunity";
import { getCurrentUserOrThrow } from "@/server/profile";

const JoinButton = ({
  profile,
  communityId,
}: {
  profile: Awaited<ReturnType<typeof getCurrentUserOrThrow>>;
  communityId: string;
}) => {
  const mutation = useJoinOrLeaveCommunity({ communityId });

  const isMember = profile.communitiesAsMember.some(
    ({ community }) => community.name === communityId,
  );

  return (
    <>
      <Button
        variant={isMember ? "outline" : "default"}
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        // variant={"ghost"}
        size={"sm"}
        className="h-auto gap-1 px-2 py-1 text-xs"
      >
        {isMember ? "Leave" : "Join"}
      </Button>
    </>
  );
};

export default JoinButton;
