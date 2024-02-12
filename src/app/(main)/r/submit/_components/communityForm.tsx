"use client";

import {
  createCommunity,
  isCommunityNameAvailable,
  updateCommunity,
} from "@/actions/community";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { uploadFile } from "@/lib/image";
import { communitySchema, communitySchemaType } from "@/schemas/community";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Community } from "../../../../../../drizzle/schema";

const CommunityForm = ({ community }: { community?: Community | null }) => {
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
      // First, check if name is available
      if (form.formState.dirtyFields.name) {
        const nameIsAvailable = await isCommunityNameAvailable(values.name);
        if (!nameIsAvailable) {
          return form.setError("name", {
            message: "Community name is taken.",
          });
        }
      }

      let imageUrl = watchImage
        ? await uploadFile(form.getValues("image")!, "community")
        : watchImage;

      const { image, ...rest } = values;
      const data = {
        ...rest,
        imageUrl,
      };

      let communityName: string;
      if (community) {
        // Update community

        communityName = values.name;

        await updateCommunity({
          communityId: community.name,
          data,
        });

        toast({
          title: "Community updated successfully",
        });
      } else {
        // Create community

        communityName = await createCommunity(data);

        toast({
          title: "Community created successfully",
        });
      }

      router.push(`/r/${communityName}`);
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
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isSubmitting || !!community}
                          />
                        </FormControl>
                        <FormDescription>
                          Name cannot be changed after the community is created.
                        </FormDescription>
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
                </div>
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
              </div>

              <div className="mt-8 flex gap-4">
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
