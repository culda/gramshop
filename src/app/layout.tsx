"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import SnackbarProvider from "@/components/SnackbarProvider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SnackbarProvider>
          <div />
          <SessionProvider>{children}</SessionProvider>
        </SnackbarProvider>
      </body>
    </html>
  );
}
