import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Google Font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: "KanbanFlow | Modern Task Management",
    template: " %s | KanbanFlow ",
  },
  description:
    "KanbanFlow is a modern Kanban app that helps you manage tasks, organize projects, and boost productivity with ease.",
  keywords: [
    "kanban",
    "task management",
    "project management",
    "productivity",
    "agile",
  ],
  authors: [{ name: "Mahmoud Elagamy" }],
  creator: "Mahmoud Elagamy",
  publisher: "Mahmoud Elagamy",
  openGraph: {
    type: "website",
    url: "https://kanbanflow-app.vercel.app/",
    siteName: "KanbanFlow",
    title: "KanbanFlow | Modern Task Management",
    description:
      "Manage tasks, organize projects, and boost productivity with KanbanFlow - your modern Kanban solution.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} flex min-h-dvh flex-col font-sans antialiased`}
      >
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <SpeedInsights />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
