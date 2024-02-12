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
import { getCurrentUserOrThrow } from "@/server/profile";
import { postSchema, postSchemaType } from "@/schemas/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Community } from "../../../../../drizzle/schema";

const PostForm = ({
  profile: user,
  community,
}: {
  profile: Awaited<ReturnType<typeof getCurrentUserOrThrow>>;
  community?: Community | null;
}) => {
  const router = useRouter();
  const mutation = useCreatePost();

  const form = useForm<postSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      communityName: community?.name,
      title: "",
      content: "",
      mediaUrl: "",
    },
  });

  const onSubmit = async (values: postSchemaType) => {
    const { id, communityName } = await mutation.mutateAsync(values);

    router.push(`/r/${communityName}/post/${id}`);
  };

  return (
    <main>
      <div className="">
        <div className="rounded-lg bg-card md:border md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="communityName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Community</FormLabel>
                    <CommunitySearch
                      user={user}
                      onChange={(communityName) => {
                        field.onChange(communityName);
                        router.push(`?communityId=${communityName}`);
                      }}
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
