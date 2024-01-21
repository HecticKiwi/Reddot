"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchCommunity } from "@/hooks/community/useSearchCommunity";
import { Community, Profile } from "@prisma/client";
import { useDebounce } from "@uidotdev/usehooks";
import { ChevronDown, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CircleImage from "./circleImage";
import { getCurrentProfile } from "@/prisma/profile";

const CommunitySearch = ({
  profile,
  community,
  onChange,
  link,
}: {
  profile: Awaited<ReturnType<typeof getCurrentProfile>>;
  community?: Community | null;
  onChange?: (newValue: number) => void;
  link?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<
    Community | undefined | null
  >(community);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const router = useRouter();

  const { data: communities, isLoading } = useSearchCommunity({
    searchQuery: debouncedSearchQuery,
  });

  if (!profile) {
    return null;
  }

  const handleSelectCommunity = (community: Community) => {
    if (onChange) {
      onChange(community.id);
      setSelectedCommunity(community);
    } else if (link) {
      router.push(`/community/${community.id}`);
    }
    setOpen(false);
  };

  useEffect(() => {
    setSelectedCommunity(community);
  }, [community]);

  const { communitiesAsMember, communitiesAsModerator } = profile;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="w-[200px]">
            {selectedCommunity && (
              <>
                <CircleImage
                  src={selectedCommunity.imageUrl}
                  alt={`${selectedCommunity.name} Image`}
                  className="mr-2 h-4 w-4"
                />
                {selectedCommunity.name}
              </>
            )}
            {!selectedCommunity && <>Search</>}

            <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9"
            />

            <CommandList>
              {searchQuery ? (
                <CommandGroup>
                  {!isLoading && communities?.length === 0 && (
                    <div className="grid h-8 place-content-center text-center text-sm">
                      Empty
                    </div>
                  )}
                  {isLoading && (
                    <div className="grid h-8 place-content-center">
                      <Loader className="animate-spin text-muted-foreground" />
                    </div>
                  )}
                  {communities?.map((community) => (
                    <CommandItem
                      key={"community" + community.id}
                      onSelect={() => handleSelectCommunity(community)}
                      value={community.id.toString()}
                    >
                      <CircleImage
                        src={community.imageUrl}
                        alt={`${community.name} Image`}
                        className="mr-2 h-4 w-4"
                      />
                      {community.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <>
                  <CommandGroup heading="MODERATING">
                    {communitiesAsModerator.map((community) => (
                      <CommandItem
                        key={"community" + community.id}
                        onSelect={() => handleSelectCommunity(community)}
                        value={"moderatingCommunity" + community.id.toString()}
                      >
                        <CircleImage
                          src={community.imageUrl}
                          alt={`${community.name} Image`}
                          className="mr-2 h-4 w-4"
                        />
                        {community.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandGroup heading="YOUR COMMUNITIES">
                    {communitiesAsMember.map((community) => (
                      <CommandItem
                        key={"yourCommunity" + community.id}
                        onSelect={() => handleSelectCommunity(community)}
                        value={"yourCommunity" + community.id.toString()}
                      >
                        <CircleImage
                          src={community.imageUrl}
                          alt={`${community.name} Image`}
                          className="mr-2 h-4 w-4"
                        />
                        {community.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default CommunitySearch;