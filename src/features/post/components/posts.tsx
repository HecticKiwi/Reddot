"use client";

import { getPosts } from "@/features/post/actions";
import { useGetPosts } from "@/features/post/hooks/useGetPosts";
import { cn } from "@/lib/utils";
import { getCurrentUserOrThrow, getUser } from "@/features/user/server";
import { Ghost, Loader2 } from "lucide-react";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "./postCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type OrderBy = "new" | "top";

const Posts = ({
  user,
  type,
  id,
  initialPosts,
  orderBy,
  className,
}: {
  user: Awaited<ReturnType<typeof getUser>>;
  type: "user" | "community";
  id: string | null;
  initialPosts?: Awaited<ReturnType<typeof getPosts>>;
  orderBy: OrderBy;
  className?: string;
}) => {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetPosts({
      type,
      id,
      orderBy,
      initialPosts: orderBy === "new" ? initialPosts : undefined,
    });

  useEffect(() => {
    if (inView && !isLoading) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isLoading]);

  // If loading first posts
  if (isLoading) {
    return <Loader2 className="mx-auto mt-8 h-10 w-10 animate-spin" />;
  }

  // If no posts
  if (data?.pages[0].length === 0 && !hasNextPage) {
    return (
      <div className="mt-16 flex flex-col items-center">
        <Ghost className="h-32 w-32 animate-hover text-branding/20" />
        {type === "community" && (
          <>
            <h2 className="mt-4 text-2xl font-semibold">
              It&apos;s a ghost town in here...
            </h2>
            <div className="mt-1 text-muted-foreground">
              Why don&apos;t you add the first post?
            </div>
          </>
        )}
        {type === "user" && id === null && (
          <>
            <h2 className="mt-4 text-2xl font-semibold">
              Nothing in your home feed.
            </h2>
            <div className="mt-1 text-muted-foreground">
              Check out{" "}
              <Link className="text-primary hover:underline" href={"r/all"}>
                r/all
              </Link>{" "}
              and join some communities.
            </div>
          </>
        )}
        {type === "user" && id && (
          <>
            <h2 className="mt-4 text-2xl font-semibold">
              This user hasn&apos;t posted anything.
            </h2>
            <div className="mt-1 text-muted-foreground">
              Maybe they&apos;re shy?
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div>
        <div className={cn("mt-6 flex flex-col gap-6", className)}>
          {data?.pages.map((page, i) => (
            <Fragment key={i}>
              {page.map((post) => (
                <PostCard
                  profile={user}
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
