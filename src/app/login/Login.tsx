"use client";
import { signIn } from "next-auth/react";
import Button from "@/components/Button";
import { PpParams } from "./page";
import Image from "next/image";

export default function Page({ callbackUrl }: PpParams["searchParams"]) {
  return (
    <div
      className="fixed top-1/2 left-1/2 md:w-md -translate-x-1/2 -translate-y-1/2 
             p-5 text-center"
    >
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 ">
        <Button
          variant="text"
          onClick={() =>
            signIn("google", {
              callbackUrl,
            })
          }
        >
          {" "}
          <Image width={20} height={20} src="/google.svg" alt="Google" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
