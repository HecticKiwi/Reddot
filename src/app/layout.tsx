import Providers from "@/components/providers/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../css/clerk.css";
import "../css/globals.css";
import "../css/tiptap.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reddot",
  description: "Reddit's Estranged Cousin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
