import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import UserCard from "./userCard";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { User } from "../../../../drizzle/schema";

const UserLink = ({
  profile,
  className,
}: {
  profile: User;
  className?: string;
}) => {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Link
          href={`/user/${profile.username}`}
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
