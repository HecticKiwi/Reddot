import { getCurrentUser } from "@/prisma/profile";
import Link from "next/link";
import AddButton from "./addButton";
import CommunitySearch from "./communitySearch";
import { ThemeSwitcher } from "./themeSwitcher";
import CustomUserButton from "./userButton";

const Header = async () => {
  const user = await getCurrentUser();

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

          {/* <CommunitySearch user={user} community={null} link /> */}
          <AddButton className="ml-auto" />
          <ThemeSwitcher />
          <CustomUserButton user={user} />
        </div>
      </header>
    </>
  );
};

export default Header;
