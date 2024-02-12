import { joinOrLeaveCommunity, updateCommunity } from "@/actions/community";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useJoinOrLeaveCommunity = ({
  communityId,
}: {
  communityId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => joinOrLeaveCommunity({ communityName: communityId }),
    mutationKey: ["joinOrLeaveCommunity", communityId],
    onSettled() {},
    onSuccess: (data: boolean) => {
      const joined = data;

      queryClient.resetQueries({
        queryKey: ["posts", "user", null],
      });

      const action = joined ? "joined" : "left";

      toast({
        title: "Success",
        description: `You have ${action} this community.`,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Failed to join this community",
        description: error.message,
      });
    },
  });
};
