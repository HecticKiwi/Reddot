import { searchCommunitiesByName } from "@/actions/community";
import { useQuery } from "@tanstack/react-query";

export const useSearchCommunity = ({
  searchQuery,
}: {
  searchQuery: string;
}) => {
  return useQuery({
    queryKey: ["communitySearch", searchQuery],
    queryFn: () => searchCommunitiesByName(searchQuery),
  });
};
