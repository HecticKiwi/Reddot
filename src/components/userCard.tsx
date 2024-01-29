import { Profile } from "@prisma/client";
import { format } from "date-fns";
import { CakeSlice, Heart } from "lucide-react";
import CircleImage from "./circleImage";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

const UserCard = ({
  profile,
  className,
}: {
  profile: Profile;
  className?: string;
}) => {
  return (
    <>
      <div className={cn("w-72 self-start rounded-lg border p-4", className)}>
        <CircleImage
          src={profile.clerkImageUrl}
          alt={profile.username}
          className="mx-auto h-24 w-24"
        />

        <h1 className="mt-2 text-center text-xl font-semibold">
          {profile.username}
        </h1>

        <p className="mt-1 text-sm">{profile.about}</p>

        <Separator className="my-4" />

        <div className="mt-4 grid grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold uppercase text-muted-foreground">
              Score
            </h2>
            <div className="mt-1 flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {profile.score}
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase text-muted-foreground">
              Date Joined
            </h2>
            <div className="mt-1 flex items-center gap-1">
              <CakeSlice className="h-4 w-4" />
              {format(profile.createdAt, "MMM dd, yyyy")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
