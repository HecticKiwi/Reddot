import * as z from "zod";

const MAX_IMAGE_SIZE = 0.5 * 1024 * 1024; // 512 KB

export const communitySchema = z.object({
  image: z
    .instanceof(File)
    .refine(
      (file) => file?.type.startsWith("image"),
      "Selected file is not an image.",
    )
    .refine(
      (file) => file?.size <= MAX_IMAGE_SIZE,
      `Max image size is 512 KB (tryna keep the S3 costs down 😤).`,
    )
    .nullable()
    .optional(),
  name: z
    .string()
    .trim()
    .min(3)
    .max(21)
    .regex(/^[a-zA-Z0-9_]*$/, {
      message:
        "Community names can only contain letters, numbers, and underscores",
    }),
  description: z.string().trim().max(200),
});

export type communitySchemaType = z.infer<typeof communitySchema>;

export type communityDto = Omit<communitySchemaType, "image"> & {
  imageUrl?: string | null;
};
