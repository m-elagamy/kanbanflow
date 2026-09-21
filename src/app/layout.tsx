import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "@/providers";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

// Google Font
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: "Kanbamy  | Modern Task Management",
    template: "%s | Kanbamy ",
  },
  description:
    "Kanbamy  is a modern Kanban app that helps you manage tasks, organize projects, and boost productivity with ease.",
  keywords: [
    "kanban",
    "task management",
    "project management",
    "productivity",
    "agile",
  ],
  creator: "Mahmoud Elagamy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geist.variable} flex min-h-dvh flex-col font-sans antialiased`}
      >
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
