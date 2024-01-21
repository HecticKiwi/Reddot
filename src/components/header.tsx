import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import CommunitySearch from "./communitySearch";
import { ThemeSwitcher } from "./themeSwitcher";
import CustomUserButton from "./userButton";
import AddButton from "./addButton";
import { getCommunityById } from "@/prisma/community";
import { getCurrentProfile } from "@/prisma/profile";

const Header = async () => {
  const profile = await getCurrentProfile();

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex max-w-screen-lg gap-6 px-6 py-4">
          <Link href="/" className="group relative flex items-center gap-2">
            <span className="block h-7 w-7 rounded-full bg-branding"></span>
            <span className="absolute block h-7 w-7 rounded-full bg-branding group-hover:animate-ping"></span>
            <span className="text-xl font-semibold">Reddot</span>
          </Link>

          <CommunitySearch profile={profile} community={null} link />
          <AddButton className="ml-auto" />
          <ThemeSwitcher />
          <CustomUserButton profile={profile} />
        </div>
      </header>
    </>
  );
};

export default Header;
