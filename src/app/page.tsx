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
import { FaLightbulb, FaMoneyBill, FaRocket } from "react-icons/fa";
import FAQSection from "@/components/FaqSection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Seo from "@/components/Seo";

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
    <div className="landing">
      <Seo
        description="Launch your shop on Telegram in 60 seconds"
        title="Shop on Telegram"
      />
      <Header />
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

      {/* features */}
      <section className="">
        <div className="container px-5 py-24 mx-auto flex flex-wrap">
          <div className="w-full md:w-1/2 mb-10 md:mb-0 pb-[120%] md:pb-[60%] rounded-lg overflow-hidden relative">
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
              src="https://www.tella.tv/video/cltg3p20l00000gjm6wl3gkvn/embed?b=0&title=0&a=1&loop=1&t=0&muted=0&wt=0"
              allowFullScreen
              allowTransparency
            ></iframe>
          </div>
          <div className="flex flex-col flex-wrap md:py-6 -mb-10 md:w-1/2 md:pl-12 md:text-left text-center">
            <div className="flex flex-col mb-10 md:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-5">
                <FaMoneyBill className="text-xl" />
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 mb-3">
                  Unlock a new sales channel
                </h2>
                <p className="leading-relaxed text-base">
                  Telegram&apos;s 800 million active users will instantly gain
                  access to your shop.
                </p>
              </div>
            </div>
            <div className="flex flex-col mb-10 md:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-5">
                <FaLightbulb className="text-xl" />
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900  mb-3">
                  Repeat orders simplified
                </h2>
                <p className="leading-relaxed text-base">
                  Improve LTV by providing a seamless repeat buying experience.
                  Users can reorder using their Telegram chat history.
                </p>
              </div>
            </div>
            <div className="flex flex-col mb-10 md:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-5">
                <FaRocket className="text-xl" />
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900  mb-3">Ultra-fast checkout</h2>
                <p className="leading-relaxed text-base">
                  Users will checkout in 30 seconds while never leaving
                  Telegram. The shopping experience is 100% integrated into the
                  Telegram client (web or app).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-100 py-8">
        <FAQSection />
      </section>

      <Footer />
    </div>
  );
}
