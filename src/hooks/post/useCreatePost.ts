import { createPost } from "@/actions/post";
import { toast } from "@/components/ui/use-toast";
import { postSchemaType } from "@/schemas/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { title } from "process";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast({
        title: "Success",
        description: "Post created successfully.",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({ title: "Something went wrong.", description: error.message });
    },
  });
};
