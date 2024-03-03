"use client";

import Button from "@/components/Button";
import FileDrop from "@/components/FileDrop";
import ShopPreview from "@/components/shop/ShopPreview";
import { Currency, TempShop } from "@/model";
import React from "react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import SupportedShops from "@/components/SupportedShops";
import Link from "next/link";

export default function Home() {
  const [upload, setUpload] = useState<TempShop | null>();
  const handleFileUpload = async (base64: string) => {
    setUpload(null);
    const res = await fetch("/api/csvupload", {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream; base64",
      },
      body: base64,
    });
    const upload = (await res.json()) as TempShop;
    setUpload(upload);
  };

  return (
    <div className="min-h-screen">
      <header className=" text-gray-800 body-font md:px-8">
        <div className="mx-auto justify-between flex flex-wrap p-5 items-center">
          <a className="flex title-font font-medium items-center md:mb-0">
            <Logo />
          </a>

          {/* <div className="flex flex-row gap-4 text-lg">
            <a href="#faq">Faq</a>
            <a href="#demo">Demo</a>
            <a href="#pricing">Pricing</a>
          </div> */}

          <div>
            <Button href="/dashboard">Login</Button>
          </div>
        </div>
      </header>
      <section className="">
        <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
          <h1 className="title-font sm:text-5xl text-4xl mb-4 font-bold">
            Launch your shop on{" "}
            <span className="thick-underline">Telegram</span> in 60 seconds
          </h1>
          <p>
            Import your shop from any major e-commerce platform and launch it on
            Telegram in a few clicks.
          </p>

          <div className="flex h-[280px] items-center justify-between">
            <FileDrop onUpload={handleFileUpload} />
          </div>
          <div className="flex flex-col gap-2 items-center">
            <SupportedShops />
          </div>
        </div>
      </section>

      {upload && (
        <section className="flex flex-col w-full items-center  border-2 bg-blue-100 mb-8 py-8">
          <h2 className="text-3xl thick-underline font-bold mb-8">
            Shop Preview
          </h2>
          <ShopPreview currency={Currency.USD} products={upload.products} />
          <div className="flex justify-center mt-8">
            <Link
              className="text-white py-4 px-8 text-xl shadow-xl bg-blue-800 rounded-xl"
              href={`/dashboard/new?id=${upload.id}`}
            >
              Launch on Telegram
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
