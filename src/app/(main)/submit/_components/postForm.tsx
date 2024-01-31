"use client";

import CommunitySearch from "@/components/communitySearch";
import TipTap from "@/components/tipTap/tipTap";
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
import { useCreatePost } from "@/hooks/post/useCreatePost";
import { getCurrentProfile } from "@/prisma/profile";
import { postSchema, postSchemaType } from "@/schemas/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { Community } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const PostForm = ({
  profile,
  community,
}: {
  profile: Awaited<ReturnType<typeof getCurrentProfile>>;
  community?: Community | null;
}) => {
  const router = useRouter();
  const mutation = useCreatePost();

  const form = useForm<postSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      communityId: community?.id,
      title: "",
      content: "",
      mediaUrl: "",
    },
  });

  const onSubmit = async (values: postSchemaType) => {
    const postId = await mutation.mutateAsync(values);

    router.push(`/community/${values.communityId}/post/${postId}`);
  };

  return (
    <main>
      <div className="">
        <div className="rounded-lg bg-card md:border md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="communityId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Community</FormLabel>
                    <CommunitySearch
                      profile={profile}
                      onChange={field.onChange}
                      community={community}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mediaUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media Link</FormLabel>
                    <FormControl>
                      <div className="mt-4">
                        <Input {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Link to media (YouTube, Facebook, Twitch, SoundCloud,
                      etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <div className="mt-4">
                        <TipTap
                          editor={{
                            content: field.value,
                            onChange: field.onChange,
                          }}
                          limit={200}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Create
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default PostForm;
