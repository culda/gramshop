"use client";
import { Inter } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import SnackbarProvider from "@/components/SnackbarProvider";
import { SessionProvider } from "next-auth/react";

const font = Inter({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className={font.className}>
        <GoogleTagManager gtmId="GTM-KW4844N3" />
        <SnackbarProvider>
          <SessionProvider>{children}</SessionProvider>
        </SnackbarProvider>
      </body>
    </html>
  );
}
