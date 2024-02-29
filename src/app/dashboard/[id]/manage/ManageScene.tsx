"use client";
import { Shop } from "@/model";
import Section from "@/components/Section";
import ShopPreview from "@/components/shop/ShopPreview";
import Button from "@/components/Button";
import { useSnackbar } from "@/components/SnackbarProvider";

type PpShop = {
  shop: Shop;
};

export const ManageScene = ({ shop }: PpShop) => {
  const snack = useSnackbar();
  const activate = async () => {
    const res = await fetch(`/api/shopactivate`, {
      method: "POST",
      body: JSON.stringify({ id: shop.id }),
    });
    if (res.ok) {
      snack({
        key: "shop-activated",
        text: "Shop activated",
        variant: "success",
      });
    } else {
      snack({
        key: "shop-activation-failed",
        text: "Shop activation failed",
        variant: "error",
      });
    }
  };
  const disable = async () => {
    const res = await fetch(`/api/shopdisable`, {
      method: "POST",
      body: JSON.stringify({ id: shop.id }),
    });
    if (res.ok) {
      snack({
        key: "shop-disabled",
        text: "Shop disabled",
        variant: "success",
      });
    } else {
      snack({
        key: "shop-disable-failed",
        text: "Shop disable failed",
        variant: "error",
      });
    }
  };
  return (
    <div className="text-gray-600 body-font">
      {/* <Section title={"Shop URL"}>
        <p>
          Configure your shop menu button via{" "}
          <a
            className="font-medium underline"
            href="https://t.me/botfather"
            target="_blank"
          >
            BotFather
          </a>
          .
        </p>
        <TextField
          defaultValue={`https://shop.com/${shop.id}`}
          onCopy={() =>
            snack({
              key: "shop-url-copied",
              text: "Copied",
              variant: "success",
            })
          }
        />
      </Section> */}
      <div className="flex flex-row gap-2 mb-4">
        <Button onClick={activate} variant="primary">
          Activate
        </Button>
        <Button onClick={disable} variant="error">
          Disable
        </Button>
      </div>
      <Section title="Setup">
        <Button href={`/dashboard/${shop.id}/telegram`} variant="primary">
          Tokens
        </Button>
      </Section>
      <Section className="mt-8" title="Preview">
        <ShopPreview currency={shop.currency} products={shop.products} />
      </Section>
    </div>
  );
};
