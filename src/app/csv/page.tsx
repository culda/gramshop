"use client";

import FileDrop from "@/components/FileDrop";
import { Header } from "@/components/Header";
import Seo from "@/components/Seo";
import { useSnackbar } from "@/components/SnackbarProvider";
import { SupportedShopsWide } from "@/components/SupportedShopsWide";
import ShopPreview from "@/components/shop/ShopPreview";
import { Currency, TempShop } from "@/model";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [upload, setUpload] = useState<TempShop | null>();
  const snack = useSnackbar();
  const handleFileUpload = async (base64: string) => {
    setUpload(null);
    try {
      const res = await fetch("/api/csvupload", {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream; base64",
        },
        body: base64,
      });
      const upload = (await res.json()) satisfies TempShop;
      setUpload(upload);
    } catch (error) {
      snack({
        key: "file-drop-error",
        text: "Error uploading file. Please reach out to support@gramshop.co",
        variant: "error",
      });
      console.error(error);
    }
  };

  return (
    <div>
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
          <SupportedShopsWide />
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
