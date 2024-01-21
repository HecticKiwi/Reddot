import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import UserCard from "./userCard";
import Link from "next/link";
import { Profile } from "@prisma/client";
import { cn } from "@/lib/utils";

const UserLink = ({
  profile,
  className,
}: {
  profile: Profile;
  className?: string;
}) => {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Link
          href={`/user/${profile.id}`}
          className={cn("hover:underline", className)}
        >
          {profile.username}
        </Link>
      </HoverCardTrigger>

      <HoverCardContent className="w-auto border-none p-0 outline-none">
        <UserCard profile={profile} />
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserLink;
