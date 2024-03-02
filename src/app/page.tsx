"use client";

import Button from "@/components/Button";
import FileDrop from "@/components/FileDrop";
import ShopPreview from "@/components/shop/ShopPreview";
import { Currency, TempShop } from "@/model";
import React from "react";
import { useState } from "react";
import Section from "@/components/Section";

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
    <div className="min-h-screen px-8">
      <header className=" text-gray-800 body-font md:px-8">
        <div className="mx-auto justify-between flex flex-wrap p-5 items-center">
          <a className="flex title-font font-medium items-center md:mb-0">
            {/* <img
              loading="lazy"
              className="aspect-[1.22] object-contain object-center w-[64px] overflow-hidden"
              alt="logo"
              src="/logo-b.webp"
            /> */}
            <span className="ml-3 text-xl">
              <b>Gram</b>Shop
            </span>
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
      <section className="flex h-[280px] items-center justify-between">
        <FileDrop onUpload={handleFileUpload} />
      </section>
      {upload && (
        <Section className="my-8" title="Preview">
          <ShopPreview currency={Currency.USD} products={upload.products} />
          <div className="flex justify-center mt-4">
            <Button href={`/dashboard/new?id=${upload.id}`} variant="primary">
              Launch on Telegram
            </Button>
          </div>
        </Section>
      )}
    </div>
  );
}
