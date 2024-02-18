"use client";
import React from "react";
import { useShop } from "./ShopContext";
import Image from "next/image";
import Button from "./Button";

const ShopPlp = () => {
  const {
    products,
    addToCart,
    getProductQuantity,
    removeFromCart,
    isProductInCart,
  } = useShop();

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-wrap -m-4">
          {products.map((product) => (
            <div key={product.id} className="p-4 relative max-w-[120px]">
              <div className="absolute top-0 right-0 bg-blue-800 text-white px-2 py-1 rounded-bl">
                {getProductQuantity(product.id)}
              </div>
              <a className="block relative  rounded overflow-hidden">
                <Image
                  alt="ecommerce"
                  className="object-cover object-center w-full h-full block"
                  src="https://dummyimage.com/500x500"
                  width={120}
                  height={120}
                />
              </a>
              <div className="mt-4">
                <h2 className="text-gray-900 title-font text-xs font-medium">
                  {product.name}{" "}
                  <span className="font-bold">{product.price}</span>
                </h2>
                {isProductInCart(product.id) ? (
                  <div className="flex flex-row gap-2 justify-center">
                    <Button
                      className="bg-blue-300"
                      onClick={() => addToCart(product)}
                    >
                      +
                    </Button>
                    <Button
                      className="bg-red-600"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopPlp;
