import * as z from "zod";

export const postSchema = z.object({
  communityName: z.string(),
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(50, "Title cannot be longer than 50 characters"),
  content: z.string().trim(),
  mediaUrl: z.string().url().optional().or(z.literal("")),
});

export type postSchemaType = z.infer<typeof postSchema>;
