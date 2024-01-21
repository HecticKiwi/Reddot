"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import { Profile } from "@prisma/client";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CircleImage from "./circleImage";

const CustomUserButton = ({ profile }: { profile: Profile }) => {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <CircleImage
            src={profile.clerkImageUrl}
            alt={profile.username}
            fallback={<User className="text-slate-500" />}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <p className="text-base font-medium">{profile.username}</p>
            <p className="w-[200px] truncate text-sm font-normal text-muted-foreground">
              {profile.clerkEmailAddress}
            </p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href={`/user/${profile.id}`}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="gap-2"
            onSelect={() => signOut(() => router.push("/sign-in"))}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CustomUserButton;
