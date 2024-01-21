import { createPost } from "@/actions/post";
import { voteOnPostOrComment } from "@/actions/vote";
import { toast } from "@/components/ui/use-toast";
import { postSchemaType } from "@/schemas/post";
import { VoteTarget } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { title } from "process";

export const useVote = ({
  targetType,
  targetId,
}: {
  targetType: VoteTarget;
  targetId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (score: 0 | 1 | -1) =>
      voteOnPostOrComment({ targetType, targetId, score }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.log(error);
      toast({ title: "Something went wrong.", description: error.message });
    },
  });
};
