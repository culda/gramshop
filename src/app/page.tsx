"use client";

import Button from "@/components/Button";
import FileDrop from "@/components/FileDrop";
import { ShopProvider } from "@/components/ShopContext";
import ShopPlp from "@/components/ShopPlp";
import { Product } from "@/model";
import React, { Fragment } from "react";
import { useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const handleFileUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = btoa(
          new Uint8Array(reader.result as ArrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        try {
          const res = await fetch("/csvupload", {
            method: "PUT",
            headers: {
              "Content-Type": "application/octet-stream; base64",
            },
            body: base64,
          });
          const products = (await res.json()) as Product[];
          setProducts(products);

          console.log("File uploaded successfully", res);
        } catch (error) {
          console.error("Error uploading file", error);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
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
              <b>Messenger</b>Shop
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
      <section className="flex min-h-screen flex-col items-center justify-between">
        {/* <input type="file" onChange={handleFileUpload} /> */}
        <FileDrop onUpload={handleFileUpload} />
      </section>
      {products.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mt-8">Shop Preview</h2>

          <div className="flex justify-center items-center">
            <div className="bg-white border-4 border-dotted border-gray-300 rounded-lg">
              <div className="flex justify-center">
                <div className="max-w-md">
                  <ShopProvider products={products}>
                    <ShopPlp />
                  </ShopProvider>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button variant="primary">Launch on Telegram</Button>
          </div>
        </section>
      )}
    </div>
  );
}
