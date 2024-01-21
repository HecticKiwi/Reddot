import * as z from "zod";

const MAX_IMAGE_SIZE = 5242880; // 5 MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const communitySchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file?.size <= MAX_IMAGE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => file?.type.startsWith("image"),
      "Selected file is not an image.",
    )
    .nullable()
    .optional(),
  name: z.string().trim().min(4).max(50),
  description: z.string().trim().max(200),
});

export type communitySchemaType = z.infer<typeof communitySchema>;

export type communityDto = Omit<communitySchemaType, "image"> & {
  imageUrl?: string | null;
};
