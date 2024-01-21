"use client";

import { voteOnPostOrComment } from "@/actions/vote";
import { cn } from "@/lib/utils";
import { VoteTarget } from "@prisma/client";
import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import { startTransition, useOptimistic } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useVote } from "@/hooks/post/useVote";

const VoteButtons = ({
  targetType,
  targetId,
  userVote,
  score,
  orientation,
}: {
  targetType: VoteTarget;
  targetId: number;
  userVote: number;
  score: number;
  orientation?: "vertical" | "horizontal";
}) => {
  const queryClient = useQueryClient();

  const mutation = useVote({ targetType, targetId });
  const [optimisticScore, changeOptimisticScore] = useOptimistic(
    { userVote, score },
    (state: { userVote: number; score: number }, change: number) => ({
      userVote: state.userVote + change,
      score: state.score + change,
    }),
  );

  const vote = async (vote: 1 | -1) => {
    const newVote = optimisticScore.userVote !== vote ? vote : 0;
    const voteChange = newVote - optimisticScore.userVote;

    startTransition(() => {
      changeOptimisticScore(voteChange);
    });

    mutation.mutate(newVote);
    // await voteOnPostOrComment({
    //   targetType,
    //   targetId,
    //   score: newVote,
    // });

    // queryClient.invalidateQueries({ refetchType: "active" });
    // await queryClient.invalidateQueries({
    //   queryKey: ["posts"],
    // });
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
              optimisticScore.userVote === 1 && "text-branding",
            )}
          />
        </button>
        <span className="text-sm font-semibold leading-none">
          {optimisticScore.score}
        </span>
        <button
          className="overflow-hidden rounded-full hover:bg-primary/20"
          onClick={() => {
            vote(-1);
          }}
        >
          <ChevronDownCircle
            className={cn(
              "text-muted-foreground",
              optimisticScore.userVote === -1 && "text-branding",
            )}
          />
        </button>
      </div>
    </>
  );
};

export default VoteButtons;
