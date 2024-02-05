import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Component, Plus, Text } from "lucide-react";
import Link from "next/link";

const AddButton = ({ className }: { className?: string }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className={className}>
          <Button size="icon" variant={"ghost"}>
            <Plus />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/submit" className="flex items-center gap-2">
              <Text className="h-4 w-4" />
              Post
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/r/submit" className="flex items-center gap-2">
              <Component className="h-4 w-4" />
              Community
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default AddButton;
