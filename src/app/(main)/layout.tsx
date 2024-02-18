import Header from "@/components/header/header";
import Setup from "@/components/setup";
import { getCurrentUser, getCurrentUserOrThrow } from "@/features/user/utils";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Reddot",
  description: "Reddit's Estranged Cousin",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/login");
  }

  // In the OAuth callback, new users are created with a random username starting with "_"
  // so it can be set here
  if (user.username.startsWith("_")) {
    return <Setup />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
