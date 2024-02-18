"use client";

import CircleImage from "@/components/circleImage";
import VoteButtons from "@/features/post/components/voteButtons";
import TimeSinceNow from "@/components/timeSinceNow";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Maximize2 } from "lucide-react";
import { Fragment, useState } from "react";
import { CommentType, User, Vote } from "../../../../drizzle/schema";
import CommentForm from "../../../app/(main)/r/[communityId]/post/[postId]/_components/commentForm";
import UserLink from "@/features/user/components/userLink";

export type CommentThing = CommentType & {
  author: User;
  fromPostAuthor: boolean;
  votes: Vote[];
  childComments: CommentThing[];
  userScore: number;
};

const Comment = ({
  comment,
  className,
}: {
  comment: CommentThing;
  className?: string;
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showCommentForm, setShowCommentForm] = useState(false);

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-[auto_1fr] items-center gap-2",
          className,
        )}
      >
        {/* Avatar */}
        <div className="flex items-center gap-2">
          <Maximize2
            className={cn(
              "h-4 w-4 cursor-pointer text-primary/25 hover:text-primary/75",
              expanded && "hidden",
            )}
            onClick={() => setExpanded(true)}
          />
          <CircleImage
            src={comment.author.avatarUrl}
            alt={comment.author.username}
            className="h-8 w-8"
          />
        </div>

        {/* Header */}
        <div className="flex items-baseline">
          <UserLink profile={comment.author} className="text-sm" />
          {comment.fromPostAuthor && (
            <span className="ml-1 text-xs font-bold text-branding/75">OP</span>
          )}
          <TimeSinceNow
            date={comment.createdAt}
            className="ml-2 text-xs text-muted-foreground"
          />
        </div>

        {/* Vertical Line */}
        <div
          className={cn("group h-full cursor-pointer", !expanded && "hidden")}
          onClick={() => setExpanded(false)}
        >
          <div className="mx-auto h-full w-[0.15rem] rounded-full bg-primary/25 group-hover:bg-primary/75"></div>
        </div>

        {/* Content */}
        <div className={cn(!expanded && "hidden")}>
          <div
            className="prose prose-sm dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          ></div>

          {/* Comment actions */}
          <div className="mt-3 flex gap-2">
            <VoteButtons
              postId={comment.postId}
              commentId={comment.id}
              authorName={comment.authorName}
              userVote={comment.userScore}
              score={comment.score}
              orientation="horizontal"
            />
            <Button
              size="sm"
              variant="ghost"
              className="h-auto p-2 text-xs leading-none text-muted-foreground"
              onClick={() => setShowCommentForm((prev) => !prev)}
            >
              Reply
            </Button>
          </div>

          {/* Comment form */}
          {showCommentForm && (
            <CommentForm
              postId={comment.postId}
              parentCommentId={comment.id}
              onSubmit={() => setShowCommentForm(false)}
            />
          )}

          {comment.childComments.length > 0 && (
            <div className="mt-8 space-y-4">
              {comment.childComments.map((childComment) => (
                <Fragment key={"childComment" + childComment.id}>
                  <Comment comment={childComment} className="-ml-3" />
                </Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Comment;
