"use client";

import { commentOnPost } from "@/actions/comment";
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
    await commentOnPost({
      postId: Number(postId),
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
