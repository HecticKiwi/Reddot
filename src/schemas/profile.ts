import * as z from "zod";

export const profileSchema = z.object({
  username: z.string().min(3).max(20),
  about: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type profileSchemaType = z.infer<typeof profileSchema>;
