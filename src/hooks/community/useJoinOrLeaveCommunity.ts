import { joinOrLeaveCommunity, updateCommunity } from "@/actions/community";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useJoinOrLeaveCommunity = ({
  communityId,
}: {
  communityId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => joinOrLeaveCommunity({ communityId }),
    mutationKey: ["joinOrLeaveCommunity", communityId],
    onSettled() {},
    onSuccess: (data: boolean) => {
      const joined = data;

      queryClient.resetQueries({
        queryKey: ["posts", "profile", null],
      });

      const action = joined ? "joined" : "left";

      toast({
        title: "Success",
        description: `You have ${action} this community.`,
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Failed to join this community",
        description: error.message,
      });
    },
  });
};
