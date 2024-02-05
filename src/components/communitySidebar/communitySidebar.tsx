import { getCommunityById } from "@/prisma/community";
import CommunitySidebarView from "./communitySidebarView";
import { notFound } from "next/navigation";
import CommunityLink from "../communityLink";

const CommunitySidebar = async ({
  communityId,
  inPost,
  className,
}: {
  communityId: string;
  inPost?: boolean;
  className?: string;
}) => {
  const community = await getCommunityById(communityId);

  if (!community) {
    notFound();
  }

  return (
    <CommunitySidebarView
      id={community.id}
      header={inPost ? `r/${community.name}` : "About Community"}
      description={community.description}
      createdAt={community.createdAt}
      memberCount={community._count.members}
      className={className}
    />
  );
};

export default CommunitySidebar;
