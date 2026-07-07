import type { Metadata } from "next";
import localFont from "next/font/local";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";


const expoArabic = localFont({
  src: [
    {
      path: "../public/fonts/expo-arabic-light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/expo-arabic-book.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/expo-arabic-medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/expo-arabic-semibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/expo-arabic-bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-expo-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wasl Academy",
  description: "منصة تعليمية احترافية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${expoArabic.variable} h-full`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
        <TooltipProvider>
          {children}
          <SanityLive />
          <Toaster richColors position="top-center" />
        
        </TooltipProvider>
      </body>
    </html>
  
  );
}
