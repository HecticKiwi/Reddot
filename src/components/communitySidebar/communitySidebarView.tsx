import { format } from "date-fns";
import { CakeSlice } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

const CommunitySidebarView = ({
  id,
  header,
  description,
  createdAt,
  inPost,
  className,
}: {
  id?: number;
  header: string;
  description: string;
  createdAt?: Date;
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

      {createdAt && (
        <div className="mt-2 flex items-center">
          <CakeSlice />
          <span className="ml-2 text-sm text-muted-foreground">
            Created {format(createdAt, "MMM dd, yyyy")}
          </span>
        </div>
      )}

      {id && (
        <>
          <Separator className="my-4" />

          <Button asChild>
            <Link href={`/submit?communityId=${id}`} className="w-full">
              Create Post
            </Link>
          </Button>
        </>
      )}
    </aside>
  );
};

export default CommunitySidebarView;
