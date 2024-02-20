import React from "react";
import Image from "next/image";

const ShopifySVG = () => (
  <Image width={20} height={20} src="/shopify.svg" alt="Shopify" />
);
const WixSVG = () => <Image width={20} height={20} src="/wix.svg" alt="Wix" />;
const SquarespaceSVG = () => (
  <Image width={20} height={20} src="/squarespace.svg" alt="Squarespace" />
);
const WooSVG = () => (
  <Image width={20} height={20} src="/woocommerce.svg" alt="Woo" />
);
const BigCommerceSVG = () => (
  <Image width={20} height={20} src="/bigcommerce.svg" alt="BigCommerce" />
);
const WeeblySVG = () => (
  <Image width={20} height={20} src="/weebly.svg" alt="Weebly" />
);

const SupportedShops = () => {
  return (
    <div className="bg-gray-50 rounded-lg flex flex-col w-fit p-4 ">
      {/* <p className="font-medium">Supported Providers</p> */}

      <div className="grid grid-cols-6 gap-4 max-w-[220px]">
        <div className="col-span-1 flex items-center justify-center">
          <ShopifySVG />
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <WixSVG />
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <SquarespaceSVG />
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <WooSVG />
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <BigCommerceSVG />
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <WeeblySVG />
        </div>
      </div>
    </div>
  );
};

export default SupportedShops;
