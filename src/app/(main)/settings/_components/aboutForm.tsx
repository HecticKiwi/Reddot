"use client";

import { updateProfile } from "@/actions/profile";
import ImageInput from "@/components/imageInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { uploadFile } from "@/lib/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const MAX_IMAGE_SIZE = 0.5 * 1024 * 1024; // 512 KB

const formSchema = z.object({
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

  about: z.string().max(200).optional(),
});

const AboutForm = ({
  about,
  imageUrl,
}: {
  about: string | null;
  imageUrl: string | null;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      about: about || undefined,
    },
    mode: "all",
  });

  const { isSubmitting } = form.formState;

  const watchImage = form.watch("image", undefined);
  let imagePreviewUrl = imageUrl;
  if (watchImage !== undefined) {
    imagePreviewUrl = watchImage ? URL.createObjectURL(watchImage) : watchImage;
  }

  useEffect(() => {
    form.reset({ about: about || undefined });
  }, [about, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let avatarUrl = watchImage
        ? await uploadFile(form.getValues("image")!, "user")
        : watchImage;

      const { image, ...rest } = values;
      const data: Partial<User> = {
        ...rest,
        avatarUrl,
      };

      await updateProfile(data);

      toast({
        title: "About updated.",
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: "User Update Error",
        description: error.message,
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageInput
                    field={field}
                    imagePreviewUrl={imagePreviewUrl}
                    isSubmitting={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="resize-none"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  A brief description of yourself shown on your profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            Save
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AboutForm;
