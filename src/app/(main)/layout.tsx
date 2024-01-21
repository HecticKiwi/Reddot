import Header from "@/components/header";
import Setup from "@/components/setup";
import "@/css/clerk.css";
import "@/css/globals.css";
import "@/css/tiptap.css";
import { initialProfile } from "@/prisma/profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reddot",
  description: "Reddit's Estranged Cousin",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await initialProfile();

  if (!profile) {
    return <Setup />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
