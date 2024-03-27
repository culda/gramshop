import Image from "next/image";
import React from "react";

export const Logo = ({ text = false }: { text?: boolean }) => {
  return (
    <span className="px-2 flex flex-row  justify-center items-center rounded-full text-xl">
      <Image width={70} height={70} src="/logo.webp" alt="Logo" />
      {text && <b>GramShop</b>}
    </span>
  );
};
