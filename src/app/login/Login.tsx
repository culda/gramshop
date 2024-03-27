"use client";
import { signIn } from "next-auth/react";
import { PpParams } from "./page";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import Seo from "@/components/Seo";

export default function Page({ callbackUrl }: PpParams["searchParams"]) {
  return (
    <div
      className="fixed top-1/2 left-1/2 md:w-md -translate-x-1/2 -translate-y-1/2 
             p-5 text-center"
    >
      <Seo title="Login" description="Login to access Gramshop" />
      <div className="bg-white flex flex-col shadow-md rounded px-8 pt-6 pb-8 ">
        <div className="mb-8">
          <Logo />
        </div>
        <p>Welcome to Gramshop! Please sign in to continue.</p>
        <div className="mx-auto mt-4">
          <button
            className="flex flex-row items-center justify-center bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded-full"
            onClick={() =>
              signIn("google", {
                callbackUrl,
              })
            }
          >
            {" "}
            <Image
              width={20}
              height={0}
              src="/google.svg"
              alt="Google"
              className="mr-2"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
