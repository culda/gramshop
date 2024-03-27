import React from "react";
import Image from "next/image";

const ShopifySVG = () => (
  <Image width={50} height={50} src="/shopify.svg" alt="Shopify" />
);
const WixSVG = () => <Image width={50} height={50} src="/wix.svg" alt="Wix" />;
const SquarespaceSVG = () => (
  <Image width={50} height={50} src="/squarespace.svg" alt="Squarespace" />
);
const WooSVG = () => (
  <Image width={100} height={50} src="/woocommerce.svg" alt="Woo" />
);
const BigCommerceSVG = () => (
  <Image width={50} height={50} src="/bigcommerce.svg" alt="BigCommerce" />
);
const WeeblySVG = () => (
  <Image width={50} height={50} src="/weebly.svg" alt="Weebly" />
);

export const SupportedShopsWide = () => {
  return (
    <div className="w-full bg-transparent">
      <div className="flex justify-between gap-4">
        <ShopifySVG />
        <WixSVG />
        <SquarespaceSVG />
        <WooSVG />
        <BigCommerceSVG />
        <WeeblySVG />
      </div>
    </div>
  );
};
