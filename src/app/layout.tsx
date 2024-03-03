"use client";
import { Alatsi, Inter } from "next/font/google";
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
      <body className={font.className}>
        <SnackbarProvider>
          <SessionProvider>{children}</SessionProvider>
        </SnackbarProvider>
      </body>
    </html>
  );
}
