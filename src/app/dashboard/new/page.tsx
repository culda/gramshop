import AppScene from "@/components/AppScene";
import React from "react";
import ShopAddScene from "./ShopAddScene";

const Page = async () => {
  return (
    <AppScene title={"New Shop"}>
      <ShopAddScene />
    </AppScene>
  );
};

export default Page;
