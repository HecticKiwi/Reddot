import { getPosts } from "@/features/post/actions";
import { OrderBy } from "@/features/post/components/posts";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetPosts = ({
  type,
  name,
  orderBy,
  initialPosts,
}: {
  type: "user" | "community";
  name: string | null;
  orderBy: OrderBy;
  initialPosts?: Awaited<ReturnType<typeof getPosts>>;
}) => {
  return useInfiniteQuery({
    queryKey: ["posts", type, name, orderBy],
    queryFn: ({ pageParam }) => getPosts({ type, name, pageParam, orderBy }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length > 0 ? pages.length : undefined;
    },
    initialPageParam: 0,
    initialData: initialPosts && {
      pages: [initialPosts],
      pageParams: [0],
    },
  });
};
