"use client";

import { PopulatedComment } from "@/actions/comment";
import CircleImage from "@/components/circleImage";
import TipTap from "@/components/tipTap/tipTap";
import { Button } from "@/components/ui/button";
import VoteButtons from "@/components/voteButtons";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Maximize2 } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import CommentForm from "./commentForm";
import UserLink from "@/components/userLink";
import useTipTap from "@/components/tipTap/useTipTap";

const Comment = ({ comment }: { comment: PopulatedComment }) => {
  const [expanded, setExpanded] = useState(true);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const editor = useTipTap({
    content: comment.content,
    readOnly: true,
  });

  return (
    <>
      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
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
            src={comment.author.clerkImageUrl}
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
          <span className="ml-2 text-xs text-muted-foreground">
            {formatDistanceToNow(comment.createdAt)} ago
          </span>
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
          {editor && <TipTap editor={editor} />}

          {/* Comment actions */}
          <div className="mt-3 flex gap-2">
            <VoteButtons
              targetType="COMMENT"
              targetId={comment.id}
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
                  <Comment comment={childComment} />
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
