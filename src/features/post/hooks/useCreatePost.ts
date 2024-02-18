import { createPost } from "@/features/post/actions";
import { toast } from "@/components/ui/use-toast";
import { postSchemaType } from "@/features/post/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { title } from "process";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", "community"],
      });
      queryClient.invalidateQueries({
        queryKey: ["posts", "user"],
      });

      toast({
        title: "Success",
        description: "Post created successfully.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({ title: "Something went wrong.", description: error.message });
    },
  });
};
