"use client";

import { getPostById } from "@/features/post/actions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useDeletePost } from "@/features/post/hooks/useDeletePost";
import { cn } from "@/lib/utils";
import { getUser } from "@/features/user/server";
import { LinkIcon, MessageSquare, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PostActions = ({
  profile,
  post,
  preview,
}: {
  profile: Awaited<ReturnType<typeof getUser>>;
  post: Awaited<ReturnType<typeof getPostById>>;
  preview?: boolean;
}) => {
  const router = useRouter();
  const deleteMutation = useDeletePost({ postId: post.id });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!profile) {
    return null;
  }

  const isOwner = post.authorName === profile.username;

  return (
    <>
      <div className="mt-4 flex items-center gap-2">
        <Button
          variant={"ghost"}
          size={"sm"}
          className="h-auto gap-1 p-1 text-xs text-muted-foreground disabled:opacity-100"
          disabled={!preview}
          onClick={() =>
            router.push(`/r/${post.community.name}/post/${post.id}`)
          }
        >
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments.length} comments</span>
        </Button>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="h-auto gap-1 p-1 text-xs text-muted-foreground"
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/r/${post.community.name}/post/${post.id}`,
            );

            toast({
              title: "Copied link.",
            });
          }}
        >
          <LinkIcon className="h-4 w-4" />
          <span>Copy link</span>
        </Button>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DropdownMenu>
            {isOwner && (
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className={cn("h-7 w-6 text-muted-foreground")}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            )}

            <DropdownMenuContent>
              {isOwner && (
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="items-center gap-2">
                    <Trash className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete post?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete your post? You can&apos;t undo
                this.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="gap-2 sm:space-x-0">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await deleteMutation.mutateAsync();
                  setIsDialogOpen(false);
                  router.push(`/r/${post.communityName}`);
                }}
                disabled={deleteMutation.isPending}
              >
                Delete post
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default PostActions;
