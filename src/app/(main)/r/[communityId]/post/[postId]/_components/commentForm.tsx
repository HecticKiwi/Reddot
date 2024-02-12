"use client";

import { commentOnPost } from "@/actions/comment";
import { getPostById } from "@/actions/post";
import TipTap from "@/components/tipTap/tipTap";
import useTipTap from "@/components/tipTap/useTipTap";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useForm } from "react-hook-form";
import * as z from "zod";

const limit = 200;

const CommentForm = ({
  postId,
  parentCommentId,
  onSubmit,
  className,
}: {
  postId: number;
  parentCommentId?: number;
  onSubmit?: () => void;
  className?: string;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: commentOnPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.setQueryData(
        ["posts", postId],
        produce((oldPost: Awaited<ReturnType<typeof getPostById>>) => {
          oldPost.comments.push({ id: -1 });
        }),
      );
    },
    onError: (error) => {
      toast({ title: "Something went wrong.", description: error.message });
    },
  });

  const editor = useTipTap({
    content: "",
    placeholder: "What are your thoughts?",
    onChange: (content) => {
      form.setValue("content", content);
    },
    limit,
  });

  const formSchema = z.object({
    content: z
      .string()
      .max(limit)
      .refine(() => editor?.state.doc.textContent, "Comment cannot be empty."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      postId,
      parentCommentId,
      content: values.content,
    });

    toast({
      title: "Comment added.",
    });

    onSubmit?.();
    editor?.commands.clearContent(true);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={cn("space-y-8", className)}
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Comment</FormLabel>
                <FormControl>
                  {editor && <TipTap editor={editor} limit={limit} />}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Comment
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CommentForm;
