import { getCommunityById } from "@/prisma/community";
import CommunitySidebarView from "./communitySidebarView";

const CommunitySidebar = async ({
  communityId,
  inPost,
}: {
  communityId: number;
  inPost?: boolean;
}) => {
  const community = await getCommunityById(communityId);

  return (
    <CommunitySidebarView
      id={community.id}
      header={inPost ? `r/${community.name}` : "About Community"}
      description={community.description}
      createdAt={community.createdAt}
    />
  );
};

export default CommunitySidebar;
