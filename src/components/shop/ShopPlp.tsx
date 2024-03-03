/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useShop } from "./ShopContext";
import Image from "next/image";
import Button from "../Button";
import { convertToLargeUnit, getCurrencySymbol } from "@/model";

export const ShopPlp = () => {
  const {
    products,
    currency,
    addToCart,
    getQuantityHtml,
    removeFromCart,
    isProductInCart,
  } = useShop();

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-wrap justify-center -m-4">
          {products.map((product) => (
            <div key={product.id} className="p-4 relative max-w-[120px]">
              {/* Conditional rendering for quantity */}
              {getQuantityHtml(product.id)}
              <a className="block relative h-[120px] rounded overflow-hidden">
                <img
                  alt={product.name}
                  className="object-cover object-center w-full h-full block"
                  src={product.image}
                />
              </a>
              <div className="mt-4 h-[64px]">
                {" "}
                {/* Fixed height for alignment */}
                <h2 className="text-gray-900 title-font text-xs font-medium">
                  <span className="font-bold">
                    {getCurrencySymbol(currency)}
                    {convertToLargeUnit(product.price)}
                  </span>{" "}
                  {product.name}
                </h2>
              </div>
              {isProductInCart(product.id) ? (
                <div className="flex flex-row gap-2 justify-center">
                  <Button
                    className="bg-blue-300"
                    onClick={() => addToCart(product)}
                  >
                    +
                  </Button>
                  <Button
                    variant="error"
                    onClick={() => removeFromCart(product.id)}
                  >
                    -
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button onClick={() => addToCart(product)}>ADD</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
