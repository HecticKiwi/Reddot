import { createPost, markPostAsRemoved } from "@/actions/post";
import { toast } from "@/components/ui/use-toast";
import { postSchemaType } from "@/schemas/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { title } from "process";

export const useMarkPostAsRemoved = ({ postId }: { postId: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markPostAsRemoved(postId),
    onSuccess: (removed, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      if (removed) {
        toast({
          title: `Post marked as removed.`,
          description: "The post will no longer be visible.",
        });
      } else {
        toast({
          title: "Post marked as unremoved.",
          description: "This post will be visible again.",
        });
      }
    },
    onError: (error) => {
      console.log(error);
      toast({ title: "Something went wrong.", description: error.message });
    },
  });
};
