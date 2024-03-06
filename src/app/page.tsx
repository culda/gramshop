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

      {/* features */}
      <section className="">
        <div className="container px-5 py-24 mx-auto flex flex-wrap">
          <div className="w-full md:w-1/2 mb-10 md:mb-0  rounded-lg overflow-hidden relative">
            <img
              alt="feature"
              className="object-cover object-center w-full h-full"
              src="/demo.webp"
            />
          </div>
          <div className="flex flex-col flex-wrap md:py-6 -mb-10 md:w-1/2 md:pl-12 md:text-left text-center">
            <div className="flex flex-col mb-10 md:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-5">
                <FaRocket className="text-xl" />
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
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
                <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
                  Integrated UX
                </h2>
                <p className="leading-relaxed text-base">
                  Users never leave Telegram. The shopping UX is 100% within the
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

      <footer className="bg-gray-200 text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <a className="flex title-font font-medium items-center md:mb-0">
              <Logo />
            </a>
            <p className="mt-2 text-sm text-gray-500">
              Gramshop helps you sell on Telegram
            </p>
          </div>
          <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                Support
              </h2>
              <nav className="list-none mb-10 flex flex-col md:items-start items-center gap-2">
                <li>
                  <a
                    href="https://t.me/+FTPqqyO__eYyNTFk"
                    target="_blank"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <div className="flex flex-row gap-2">
                      <img
                        className="text-sm w-6 h-6"
                        src="/telegram-logo.svg"
                        alt="telegram"
                      ></img>
                      Telegram
                    </div>
                  </a>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                Site Map
              </h2>
              <nav className="list-none mb-10 flex flex-col md:items-start items-center gap-2">
                <li>
                  <Link
                    href="/legal/privacy"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <div className="flex flex-row gap-2">Privacy Policy</div>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <div className="flex flex-row gap-2">Terms of Service</div>
                  </Link>
                </li>
              </nav>
            </div>
          </div>
        </div>
        <div className="bg-gray-100">
          <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © 2024 Gramshop
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
