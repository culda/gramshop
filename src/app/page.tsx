"use client";

import FileDrop from "@/components/FileDrop";
import ShopPreview from "@/components/shop/ShopPreview";
import { Currency, TempShop } from "@/model";
import React from "react";
import { useState } from "react";
import { SupportedShopsWide } from "@/components/SupportedShopsWide";
import Link from "next/link";
import { FaLightbulb, FaMoneyBill, FaRocket } from "react-icons/fa";
import FAQSection from "@/components/FaqSection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Seo from "@/components/Seo";
import { useSnackbar } from "@/components/SnackbarProvider";
import TextField from "@/components/TextField";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";

type FormValues = {
  url: string;
};

export default function Page() {
  const snack = useSnackbar();
  const { formState, register, handleSubmit } = useForm<FormValues>({});

  const onSubmit = async ({ url }: FormValues) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/requestdemo`,
        {
          method: "PUT",
          body: JSON.stringify({
            url,
          }),
        }
      );
      snack({
        key: "request-demo-success",
        text: "Success",
        variant: "success",
      });
      return;
    } catch (err) {
      snack({
        key: "request-demo-failure",
        text: "Something went wrong",
        variant: "error",
      });
    }
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
            Drop your shop URL below and we will generate a demo store for your
            business that is ready to accept crypto payments.
          </p>

          <div className="flex h-[80px] mb-2 items-center justify-between">
            <form id="url-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-row gap-2 ">
                <div className="sm:flex relative focus:outline-none appearance-none mr-4 px-2 rounded-md border bg-transparent border-blue-800 focus-within:ring-2 focus-within:border-transparent shadow-xl">
                  <span className="flex items-center pl-3 text-gray-800 font-bold rounded-lg">
                    https://
                  </span>
                  <input
                    className="sm:flex relative focus:outline-none appearance-none mr-4 px-2 rounded-md bg-transparent"
                    {...register("url", { required: true })}
                  />
                </div>
                <Button
                  form="url-form"
                  type="submit"
                  className="w-full"
                  loading={formState.isSubmitting}
                  disabled={!formState.isValid}
                  variant="primary"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
          <SupportedShopsWide />
        </div>
      </section>

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
            ></iframe>
          </div>
          <div className="flex flex-col flex-wrap md:py-6 -mb-10 md:w-1/2 md:pl-12 md:text-left text-center">
            <div className="flex flex-col mb-10 md:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-5">
                <FaMoneyBill className="text-xl" />
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 mb-3">
                  Accept crypto payments via Telegram wallet
                </h2>
                <p className="leading-relaxed text-base">
                  Telegram&apos;s 900 million active users will be able to use
                  the native Telegram crypto wallet to pay for your products.
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
