"use client";

import { createCommunity, updateCommunity } from "@/actions/community";
import CircleImage from "@/components/circleImage";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { uploadFile } from "@/lib/image";
import { communitySchema, communitySchemaType } from "@/schemas/community";
import { zodResolver } from "@hookform/resolvers/zod";
import { Community } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";

const CommunityForm = ({ community }: { community?: Community | null }) => {
  const fileUpload = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<communitySchemaType>({
    resolver: zodResolver(communitySchema),
    defaultValues: community || {
      image: undefined,
      name: "",
      description: "",
    },
  });

  const { isSubmitting } = form.formState;

  const watchImage = form.watch("image", undefined);

  let imagePreviewUrl = community?.imageUrl;
  if (watchImage !== undefined) {
    imagePreviewUrl = watchImage ? URL.createObjectURL(watchImage) : watchImage;
  }

  const onSubmit = async (values: communitySchemaType) => {
    try {
      let imageUrl = watchImage
        ? await uploadFile(form.getValues("image")!, "community")
        : watchImage;

      const { image, ...rest } = values;
      const data = {
        ...rest,
        imageUrl,
      };

      let communityId: number;
      if (community) {
        // Update

        communityId = community.id;

        await updateCommunity({
          communityId,
          data,
        });

        toast({
          title: "Community updated successfully",
        });
      } else {
        // Create
        communityId = await createCommunity(data);

        toast({
          title: "Community created successfully",
        });
      }

      router.push(`/community/${communityId}`);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Community Form Error",
        description: error.message,
      });
    }
  };

  return (
    <>
      <div className="mx-auto mt-8 max-w-screen-lg px-8">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight">
          {community && `Edit the ${community.name} Community`}
          {!community && `Create Community`}
        </h1>
        <div className="rounded-lg bg-card md:border md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <>
                        <CircleImage
                          src={imagePreviewUrl}
                          alt={`Image Preview`}
                          className="h-32 w-32"
                        />

                        <Input
                          type="file"
                          {...rest}
                          ref={fileUpload}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0];

                            if (file) {
                              onChange(file);
                            }
                          }}
                          className="hidden"
                          accept="image/*"
                        />
                        <Button
                          className=""
                          onClick={() => fileUpload.current?.click()}
                          type="button"
                          disabled={isSubmitting}
                        >
                          Upload
                        </Button>
                        <Button
                          className="ml-4"
                          onClick={() => onChange(null)}
                          type="button"
                          variant="destructive"
                          disabled={isSubmitting}
                        >
                          Remove
                        </Button>
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {community ? "Save" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default CommunityForm;
