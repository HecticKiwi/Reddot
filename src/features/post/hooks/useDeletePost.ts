import { createPost, deletePost } from "@/features/post/actions";
import { toast } from "@/components/ui/use-toast";
import { postSchemaType } from "@/features/post/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { title } from "process";

export const useDeletePost = ({ postId }: { postId: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["posts"] });

      toast({
        title: "Post deleted successfully.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({ title: "Post deletion failed.", description: error.message });
    },
  });
};
