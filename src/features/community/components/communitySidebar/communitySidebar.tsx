import { getCommunityById } from "@/features/community/server";
import CommunitySidebarView from "./communitySidebarView";
import { notFound } from "next/navigation";
import CommunityLink from "../communityLink";

const CommunitySidebar = async ({
  communityName,
  inPost,
  className,
}: {
  communityName: string;
  inPost?: boolean;
  className?: string;
}) => {
  const community = await getCommunityById(communityName);

  if (!community) {
    notFound();
  }

  return (
    <CommunitySidebarView
      communityName={community.name}
      header={inPost ? `r/${community.name}` : "About Community"}
      description={community.description}
      createdAt={community.createdAt}
      memberCount={community.members.length}
      className={className}
    />
  );
};

export default CommunitySidebar;
