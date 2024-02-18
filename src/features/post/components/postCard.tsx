"use client";

import CircleImage from "@/components/circleImage";
import TimeSinceNow from "@/components/timeSinceNow";
import { Button } from "@/components/ui/button";
import CommunityLink from "@/features/community/components/communityLink";
import { getPostById } from "@/features/post/actions";
import MediaPlayer from "@/features/post/components/mediaPlayer";
import UserLink from "@/features/user/components/userLink";
import { getUser } from "@/features/user/utils";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import PostActions from "./postActions";
import VoteButtons from "./voteButtons";

const PostCard = ({
  profile,
  initialPost,
  postId,
  inCommunity,
  preview,
}: {
  profile: Awaited<ReturnType<typeof getUser>>;
  initialPost?: Awaited<ReturnType<typeof getPostById>>;
  postId: number;
  inCommunity?: boolean;
  preview?: boolean;
}) => {
  const { data: post } = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => getPostById(postId),
    initialData: initialPost,
  });

  if (!post) {
    return null;
  }

  return (
    <>
      <div className="flex overflow-hidden rounded-lg border">
        <aside className="flex flex-col items-center gap-1 bg-muted p-4 text-center">
          <VoteButtons
            postId={post.id}
            commentId={null}
            authorName={post.authorName}
            userVote={post.userScore}
            score={post.score}
          />
        </aside>
        <div className={cn("flex-grow p-4", preview && "")}>
          <div className="mb-1 flex flex-wrap items-center gap-y-1 text-xs text-slate-400">
            {(!inCommunity || !preview) && (
              <>
                <CircleImage
                  src={post.community.imageUrl}
                  alt={`${post.community.name} Image`}
                  className="mr-1 h-6 w-6"
                />
                <CommunityLink
                  community={post.community}
                  className="font-semibold text-primary"
                />
              </>
            )}
            <span>
              &nbsp;• Posted by u/
              <UserLink profile={post.author} />
              &nbsp;
              <TimeSinceNow date={post.createdAt} />
            </span>
          </div>
          {preview && (
            <Link
              href={`/r/${post.community.name}/post/${post.id}`}
              className="block"
            >
              <h2 className="text-xl font-semibold hover:text-branding active:text-branding">
                {post.title}
              </h2>
            </Link>
          )}
          {!preview && <h2 className="text-xl font-semibold">{post.title}</h2>}
          {/* Media */}
          {post.mediaUrl && (
            <Button
              asChild
              variant="link"
              className="max-w-[200px] p-0 text-xs text-sky-600 underline-offset-0"
            >
              <Link href={post.mediaUrl} target="_blank" className="gap-2">
                <span className="truncate">{post.mediaUrl}</span>
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
              </Link>
            </Button>
          )}
          {post.mediaUrl && <MediaPlayer url={post.mediaUrl} className="" />}
          {/* Content */}
          {post.content && (
            <div
              className="prose prose-sm mt-4 dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
          )}
          {/* Bottom actions */}
          <PostActions post={post} preview={preview} profile={profile} />
        </div>
      </div>
    </>
  );
};

export default PostCard;
