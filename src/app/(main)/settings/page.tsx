import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { getCurrentUserOrThrow } from "@/server/profile";
import { Rocket } from "lucide-react";
import AboutForm from "./_components/aboutForm";

const SettingsPage = async () => {
  const profile = await getCurrentUserOrThrow();

  return (
    <>
      <main className="mx-auto max-w-screen-lg p-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your profile</p>

        <Separator className="my-8" />

        <AboutForm about={profile.about} imageUrl={profile.avatarUrl} />
      </main>
    </>
  );
};

export default SettingsPage;
