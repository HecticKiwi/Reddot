import Header from "@/components/header";
import Setup from "@/components/setup";
import "@/css/clerk.css";
import "@/css/globals.css";
import "@/css/tiptap.css";
import { validateRequest } from "@/lib/auth";
import {
  getCurrentUser,
  initialProfile as initialUser,
} from "@/prisma/profile";
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
  const user = await initialUser();

  if (!user?.username) {
    return <Setup />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
