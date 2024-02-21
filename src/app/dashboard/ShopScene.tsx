"use client";
import { Shop } from "@/model";
import Section from "@/components/Section";
import ShopPreview from "@/components/ShopPreview";
import { FaCheckCircle } from "react-icons/fa";
import Button from "@/components/Button";

type PpShop = {
  shop: Shop;
  edit?: boolean;
};

const ShopScene = ({ shop, edit = false }: PpShop) => {
  const connected = !!shop.botToken;
  return (
    <div className="text-gray-600 body-font">
      <Section
        title={
          !connected ? (
            "Connect Telegram"
          ) : (
            <h2 className="font-bold title-font text-gray-900 mb-1 text-xl flex flex-row gap-2 items-center">
              Telegram Connected <FaCheckCircle className="text-green-500" />
            </h2>
          )
        }
      >
        {!connected && (
          <Button href={`/dashboard/${shop.id}/telegram`} variant="primary">
            Connect Telegram
          </Button>
        )}
      </Section>
      <Section title="Preview">
        <ShopPreview products={shop.products} />
      </Section>
    </div>
  );
};

export default ShopScene;
