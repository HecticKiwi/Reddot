import { createPost, deletePost } from "@/actions/post";
import { toast } from "@/components/ui/use-toast";
import { postSchemaType } from "@/schemas/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { title } from "process";

export const useDeletePost = ({ postId }: { postId: string }) => {
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
