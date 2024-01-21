import { getPostById } from "@/actions/post";
import CircleImage from "@/components/circleImage";
import CommunityLink from "@/components/communityLink";
import MediaPlayer, { ReactPlayer } from "@/components/mediaPlayer";
import TimeSinceNow from "@/components/timeSinceNow";
import TipTap from "@/components/tipTap/tipTap";
import { Button } from "@/components/ui/button";
import UserLink from "@/components/userLink";
import VoteButtons from "@/components/voteButtons";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PostActions from "./postActions";
import { getCurrentProfile } from "@/prisma/profile";

const PostCard = ({
  profile,
  post,
  inCommunity,
  preview,
}: {
  profile: Awaited<ReturnType<typeof getCurrentProfile>>;
  post: Awaited<ReturnType<typeof getPostById>>;
  inCommunity?: boolean;
  preview?: boolean;
}) => {
  const userVote = post.userScore;
  console.log(post);

  return (
    <>
      <div className="flex overflow-hidden rounded-lg border">
        <aside className="flex flex-col items-center gap-1 bg-muted p-4 text-center">
          <VoteButtons
            targetType="POST"
            targetId={post.id}
            userVote={userVote}
            score={post.score}
          />
        </aside>
        <div className={cn("flex-grow p-4", preview && "")}>
          <div className="mb-1 flex items-center text-xs text-slate-400">
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
                &nbsp;•&nbsp;
              </>
            )}
            Posted by u/
            <UserLink profile={post.author} />
            &nbsp;
            <TimeSinceNow date={post.createdAt} />
          </div>
          {preview && (
            <Link href={`/post/${post.id}`} className="block">
              <h2 className="text-xl font-semibold">{post.title}</h2>
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
          <TipTap
            className="mt-4"
            editor={{ content: post.content, readOnly: true }}
          />

          {/* Bottom actions */}
          <PostActions post={post} preview={preview} profile={profile} />
        </div>
      </div>
    </>
  );
};

export default PostCard;
