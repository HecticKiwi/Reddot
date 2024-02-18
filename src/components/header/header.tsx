import CommunitySearch from "@/features/community/components/communitySearch";
import UserButton from "@/features/user/components/userButton";
import { getCurrentUserOrThrow } from "@/features/user/utils";
import Link from "next/link";
import { ThemeSwitcher } from "../themeSwitcher";
import AddButton from "./addButton";

const Header = async () => {
  const user = await getCurrentUserOrThrow();

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex max-w-screen-lg gap-4 px-6 py-3">
          <Link href="/" className="group relative flex items-center gap-2">
            <span className="block h-7 w-7 rounded-full bg-branding"></span>
            <span className="absolute block h-7 w-7 rounded-full bg-branding group-hover:animate-ping"></span>
            <span className="hidden text-xl font-semibold sm:inline">
              Reddot
            </span>
          </Link>

          <CommunitySearch user={user} community={null} link />
          <AddButton className="ml-auto" />
          <ThemeSwitcher />
          <UserButton user={user} />
        </div>
      </header>
    </>
  );
};

export default Header;
