"use client";

import { Button } from "@/components/ui/button";
import { Fragment, useEffect, useState } from "react";
import PostCard from "../../../../../components/postCard";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { Ghost, Loader } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetPosts } from "@/hooks/post/useGetPosts";
import { getCurrentProfile } from "@/prisma/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type OrderBy = "new" | "top";

const Posts = ({
  profile,
  type,
  id,
  className,
}: {
  profile: Awaited<ReturnType<typeof getCurrentProfile>>;
  type: "profile" | "community";
  id: number | null;
  className?: string;
}) => {
  const queryClient = useQueryClient();

  const { ref, inView } = useInView();
  const [orderBy, setOrderBy] = useState<OrderBy>("new");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetPosts({
    type,
    id,
    orderBy: orderBy,
  });
  console.log(data);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  // If no posts
  if (data?.pages[0].length === 0 && !hasNextPage) {
    return (
      <div className="mt-16 flex flex-col items-center">
        <Ghost className="h-32 w-32 animate-hover text-branding/20" />
        <h2 className="mt-4 text-2xl font-semibold">
          It's a ghost town in here...
        </h2>
        <div className="mt-1 text-muted-foreground">
          Why don't you add the first post?
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <Button
        onClick={() => {
          queryClient.invalidateQueries({
            queryKey: ["posts"],
          });
        }}
      >
        Refetch
      </Button> */}
      <div>
        <Tabs
          defaultValue="new"
          onValueChange={(value) => setOrderBy(value as OrderBy)}
          className="flex justify-end"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="top">Top</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className={cn("mt-6 flex flex-col gap-6", className)}>
          {data?.pages.map((page, i) => (
            <Fragment key={i}>
              {page.map((post) => (
                <PostCard
                  profile={profile}
                  key={`${i}asdf-${post.id}`}
                  post={post}
                  preview
                />
              ))}
            </Fragment>
          ))}

          <div
            ref={ref}
            className="my-4 grid place-content-center text-sm text-muted-foreground"
          >
            {isFetchingNextPage && <Loader className="animate-spin" />}
            {data && !hasNextPage && <span>No more posts.</span>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Posts;
