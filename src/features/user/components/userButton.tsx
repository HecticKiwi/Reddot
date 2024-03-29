import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, LogOut, Settings, UserIcon } from "lucide-react";
import Link from "next/link";
import { User } from "../../../../drizzle/schema";
import { Button } from "@/components/ui/button";
import CircleImage from "@/components/circleImage";

const UserButton = ({ user }: { user: User }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-auto gap-2 px-2 py-1">
            <CircleImage
              src={user.avatarUrl}
              alt={user.username}
              fallback={<UserIcon className="text-slate-500" />}
              className="h-8 w-8"
            />

            <div className="text-start">
              <div className="text-xs ">{user.username}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Heart className="h-3 w-3" />
                {user.score}
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <p className="text-base font-medium">{user.username}</p>
            <p className="w-[200px] truncate text-sm font-normal text-muted-foreground">
              {user.email}
            </p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href={`/user/${user.username}`}
              className="flex items-center gap-2"
            >
              <UserIcon className="h-4 w-4" />
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

          <DropdownMenuItem asChild>
            <Link href="/logout" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserButton;
