import AppScene from "@/components/AppScene";
import React from "react";
import { NewScene } from "./NewScene";

const Page = async () => {
  return (
    <AppScene title={"New Shop"}>
      <NewScene />
    </AppScene>
  );
};

export default Page;
