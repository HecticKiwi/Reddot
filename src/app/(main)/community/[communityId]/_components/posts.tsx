"use client";

import { Button } from "@/components/ui/button";
import { Fragment, useEffect, useState } from "react";
import PostCard from "../../../../../components/postCard";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { Ghost, Loader, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetPosts } from "@/hooks/post/useGetPosts";
import { getCurrentProfile } from "@/prisma/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts } from "@/actions/community";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type OrderBy = "new" | "top";

const Posts = ({
  profile,
  type,
  id,
  initialPosts,
  orderBy,
  className,
}: {
  profile: Awaited<ReturnType<typeof getCurrentProfile>>;
  type: "profile" | "community";
  id: number | null;
  initialPosts?: Awaited<ReturnType<typeof getPosts>>;
  orderBy: OrderBy;
  className?: string;
}) => {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetPosts({
      type,
      id,
      orderBy: orderBy,
      initialPosts: orderBy === "new" ? initialPosts : undefined,
    });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  // If loading first posts
  if (isLoading) {
    return <Loader2 className="mx-auto mt-8 h-10 w-10 animate-spin" />;
  }

  // If no posts
  if (data?.pages[0].length === 0 && !hasNextPage) {
    return (
      <div className="mt-16 flex flex-col items-center">
        <Ghost className="h-32 w-32 animate-hover text-branding/20" />
        <h2 className="mt-4 text-2xl font-semibold">
          It&apos;s a ghost town in here...
        </h2>
        <div className="mt-1 text-muted-foreground">
          Why don&apos;t you add the first post?
        </div>
      </div>
    );
  }

  const getSortHref = (sort: OrderBy) => {
    const url = window.location.href;

    const urlObject = new URL(url);
    urlObject.searchParams.set("sort", sort);
    console.log(urlObject.toString());

    return urlObject.toString();
  };

  return (
    <>
      <div>
        <div className={cn("mt-6 flex flex-col gap-6", className)}>
          {data?.pages.map((page, i) => (
            <Fragment key={i}>
              {page.map((post) => (
                <PostCard
                  profile={profile}
                  key={`${i}asdf-${post.id}`}
                  initialPost={post}
                  postId={post.id}
                  preview
                />
              ))}
            </Fragment>
          ))}

          <div
            ref={ref}
            className="my-4 grid place-content-center text-sm text-muted-foreground"
          >
            {isFetchingNextPage && <Loader2 className="animate-spin" />}
            {data && !hasNextPage && <span>No more posts.</span>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Posts;
