import { searchCommunitiesByName } from "@/actions/community";
import { Community } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const useSearchCommunity = ({
  searchQuery,
}: {
  searchQuery: string;
}) => {
  return useQuery<Community[]>({
    queryKey: ["communitySearch", searchQuery],
    queryFn: () => searchCommunitiesByName(searchQuery),
  });
};
