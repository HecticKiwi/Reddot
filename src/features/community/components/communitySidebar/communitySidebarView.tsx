import { format } from "date-fns";
import { CakeSlice, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const CommunitySidebarView = ({
  communityName,
  header,
  description,
  createdAt,
  memberCount,
  inPost,
  className,
}: {
  communityName?: string;
  header: string;
  description: string;
  createdAt?: Date;
  memberCount?: number;
  inPost?: boolean;
  className?: string;
}) => {
  return (
    <aside className={cn("w-72 self-start rounded-lg border p-4", className)}>
      <h2 className="text-sm font-semibold text-muted-foreground">{header}</h2>

      <div className="mt-4 text-sm">
        {description && <span>{description}</span>}
        {!description && (
          <span className="italic text-muted-foreground">No description.</span>
        )}
      </div>

      {(memberCount || createdAt) && <Separator className="my-4" />}

      <div className="space-y-2">
        {memberCount !== undefined && (
          <div className="flex items-center">
            <User />
            <span className="ml-2 text-sm text-muted-foreground">
              {memberCount} member{memberCount !== 1 && "s"}
            </span>
          </div>
        )}
        {createdAt && (
          <div className="flex items-center">
            <CakeSlice />
            <span className="ml-2 text-sm text-muted-foreground">
              Created {format(createdAt, "MMM dd, yyyy")}
            </span>
          </div>
        )}
      </div>

      {communityName && (
        <>
          <Separator className="my-4" />

          <Button asChild>
            <Link
              href={`/submit?communityId=${communityName}`}
              className="w-full"
            >
              Create Post
            </Link>
          </Button>
        </>
      )}
    </aside>
  );
};

export default CommunitySidebarView;
