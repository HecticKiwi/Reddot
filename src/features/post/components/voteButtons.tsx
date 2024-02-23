"use client";

import { Score, getPostById } from "@/features/post/actions";
import { voteOnPostOrComment } from "@/features/vote/actions";
import { cn } from "@/lib/utils";
import { getCommentsForPost } from "@/features/comment/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import { toast } from "../../../components/ui/use-toast";

const VoteButtons = ({
  postId,
  commentId,
  authorName: authorId,
  userVote,
  score,
  orientation,
}: {
  postId: number | null;
  commentId: number | null;
  authorName: string;
  userVote: number;
  score: number;
  orientation?: "vertical" | "horizontal";
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (score: Score) =>
      voteOnPostOrComment({
        postId: !commentId ? postId : null,
        commentId,
        authorId,
        score,
      }),

    onMutate(newVote) {
      const voteChange = newVote - userVote;

      // Vote on comment
      if (commentId) {
        queryClient.setQueryData(
          ["comments", postId],
          produce(
            (oldComments: Awaited<ReturnType<typeof getCommentsForPost>>) => {
              const comment = oldComments.find(
                (comment) => comment.id === commentId,
              );

              if (comment) {
                comment.score += voteChange;
                comment.userScore = newVote;
              }
            },
          ),
        );

        // Vote on post
      } else if (!commentId) {
        queryClient.setQueryData(
          ["posts", postId],
          produce((oldPost: Awaited<ReturnType<typeof getPostById>>) => {
            oldPost.score += voteChange;
            oldPost.userScore = newVote;
          }),
        );
      }
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast({ title: "Something went wrong.", description: error.message });
    },
  });

  const vote = async (vote: 1 | -1) => {
    const newVote = userVote !== vote ? vote : 0;
    await mutation.mutateAsync(newVote);
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col items-center gap-1",
          orientation === "horizontal" && "flex-row",
        )}
      >
        <button
          className={cn("overflow-hidden rounded-full hover:bg-primary/20")}
          onClick={() => {
            vote(1);
          }}
        >
          <ChevronUpCircle
            className={cn(
              "text-muted-foreground",
              userVote === 1 && "text-branding",
            )}
          />
        </button>
        <span className="text-sm font-semibold leading-none">{score}</span>
        <button
          className="overflow-hidden rounded-full hover:bg-primary/20"
          onClick={() => {
            vote(-1);
          }}
        >
          <ChevronDownCircle
            className={cn(
              "text-muted-foreground",
              userVote === -1 && "text-branding",
            )}
          />
        </button>
      </div>
    </>
  );
};

export default VoteButtons;
