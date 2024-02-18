import { searchCommunitiesByName } from "@/features/community/actions";
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
