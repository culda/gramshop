import { Product } from "@/model";
import React from "react";
import { ShopProvider } from "./ShopContext";
import { ShopPlp } from "./ShopPlp";

const ShopPreview = ({ products }: { products: Product[] }) => {
  return (
    <section>
      <div className="flex justify-center items-center">
        <div className="bg-white border-4 border-dotted border-gray-300 rounded-lg">
          <div className="flex justify-center">
            <div className="max-w-md">
              <ShopProvider id={"1"} products={products} preview>
                <ShopPlp />
              </ShopProvider>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopPreview;
