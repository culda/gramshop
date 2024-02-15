"use client";
import React from "react";
import { useShop } from "./ShopContext";

const ShopPlp = () => {
  const { products, addToCart } = useShop();

  return (
    <div>
      {products.map((product) => (
        <div className="product" key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ShopPlp;
