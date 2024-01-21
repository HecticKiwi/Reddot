import { UserProfile } from "@clerk/nextjs";
import AboutForm from "./_components/aboutForm";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket } from "lucide-react";
import { getCurrentProfile } from "@/prisma/profile";

const SettingsPage = async () => {
  const profile = await getCurrentProfile();

  return (
    <>
      <main className="mx-auto max-w-screen-lg p-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your profile</p>

        <Separator className="my-8" />

        <AboutForm about={profile.about} />

        <div className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight">Clerk Settings</h1>
          <p className="text-muted-foreground">
            Manage your Clerk account information
          </p>

          <Alert className="my-8">
            <Rocket className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              If you change your profile picture, refresh the page to see the
              changes.
            </AlertDescription>
          </Alert>

          <UserProfile />
        </div>
      </main>
    </>
  );
};

export default SettingsPage;
