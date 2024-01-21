import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import UserCard from "./userCard";
import Link from "next/link";
import CommunitySidebarView from "./communitySidebar/communitySidebarView";
import { Community } from "@prisma/client";
import { cn } from "@/lib/utils";

const CommunityLink = ({
  community,
  className,
}: {
  community: Community;
  className?: string;
}) => {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Link
          href={`/community/${community.id}`}
          className={cn("hover:underline", className)}
        >
          r/{community.name}
        </Link>
      </HoverCardTrigger>

      <HoverCardContent className="w-auto border-none p-0 outline-none">
        <CommunitySidebarView
          id={community.id}
          header={"About Community"}
          description={community.description}
          createdAt={community.createdAt}
        />
      </HoverCardContent>
    </HoverCard>
  );
};

export default CommunityLink;