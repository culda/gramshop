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
    // if (!event.target.files || !event.target.files[0]) {
    //   return;
    // }
    // const file = event.target.files[0];

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
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* <input type="file" onChange={handleFileUpload} /> */}
      <FileDrop onUpload={handleFileUpload} />

      {products.length > 0 && (
        <Fragment>
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
        </Fragment>
      )}
    </main>
  );
}
