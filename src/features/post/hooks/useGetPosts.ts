import { getPosts } from "@/features/post/actions";
import { OrderBy } from "@/features/post/components/posts";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetPosts = ({
  type,
  id,
  orderBy,
  initialPosts,
}: {
  type: "user" | "community";
  id: string | null;
  orderBy: OrderBy;
  initialPosts?: Awaited<ReturnType<typeof getPosts>>;
}) => {
  return useInfiniteQuery({
    queryKey: ["posts", type, id, orderBy],
    queryFn: ({ pageParam }) =>
      getPosts({ type, name: id, pageParam, orderBy }),
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