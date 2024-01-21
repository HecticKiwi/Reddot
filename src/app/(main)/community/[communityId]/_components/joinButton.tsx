"use client";

import { Button } from "@/components/ui/button";
import { useJoinOrLeaveCommunity } from "@/hooks/community/useJoinOrLeaveCommunity";
import { getCurrentProfile } from "@/prisma/profile";

const JoinButton = ({
  profile,
  communityId,
}: {
  profile: Awaited<ReturnType<typeof getCurrentProfile>>;
  communityId: number;
}) => {
  const mutation = useJoinOrLeaveCommunity({ communityId });

  const isMember = profile.communitiesAsMember.some(
    (community) => community.id === communityId,
  );

  return (
    <>
      <Button
        variant={isMember ? "outline" : "default"}
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
      >
        {isMember ? "Leave" : "Join"}
      </Button>
    </>
  );
};

export default JoinButton;
