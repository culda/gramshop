"use client";
import { Shop } from "@/model";
import Section from "@/components/Section";
import ShopPreview from "@/components/ShopPreview";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
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
      <Section title="Setup">
        <Button onClick={activate} variant="primary">
          Activate Menu Button
        </Button>
        <Button href={`/dashboard/${shop.id}/telegram`} variant="primary">
          Tokens
        </Button>
      </Section>
      <Section title="Preview">
        <ShopPreview products={shop.products} />
      </Section>
    </div>
  );
};
