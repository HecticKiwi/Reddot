import { getPosts } from "@/actions/community";
import { OrderBy } from "@/app/(main)/r/[communityId]/_components/posts";
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
    queryFn: ({ pageParam }) => getPosts({ type, id, pageParam, orderBy }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length > 0 ? lastPage[lastPage.length - 1].id : undefined;
    },
    initialPageParam: "",
    initialData: initialPosts && {
      pages: [initialPosts],
      pageParams: [""],
    },
  });
};
