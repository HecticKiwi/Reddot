import { getPosts } from "@/actions/community";
import { OrderBy } from "@/app/(main)/community/[communityId]/_components/posts";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetPosts = ({
  type,
  id,
  orderBy,
}: {
  type: "profile" | "community";
  id: number | null;
  orderBy: OrderBy;
}) => {
  return useInfiniteQuery({
    queryKey: ["posts", type, id, orderBy],
    queryFn: ({ pageParam }) => getPosts({ type, id, pageParam, orderBy }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length > 0 ? lastPage[lastPage.length - 1].id : undefined,
    initialPageParam: 0,
  });
};
