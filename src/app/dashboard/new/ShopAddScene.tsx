"use client";
import FileDrop from "@/components/FileDrop";
import { Product } from "@/model";
import React, { useState } from "react";

const ShopAddScene = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const handleFileUpload = async (base64: string) => {
    const res = await fetch("/csvupload", {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream; base64",
      },
      body: base64,
    });
    const products = (await res.json()) as Product[];
    setProducts(products);
  };

  return (
    <div>
      <FileDrop onUpload={handleFileUpload} />
    </div>
  );
};

export default ShopAddScene;
