"use client";
import Button from "@/components/Button";
import FileDrop from "@/components/FileDrop";
import Section from "@/components/Section";
import ShopPreview from "@/components/ShopPreview";
import { useSnackbar } from "@/components/SnackbarProvider";
import SupportedShops from "@/components/SupportedShops";
import TextField from "@/components/TextField";
import { PutShopRequest } from "@/functions/shop/put/handler";
import { Product, Shop } from "@/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type TpValues = {
  name: string;
};

const schema = z.object({
  name: z.string({ required_error: "Bot token is required" }),
});

export const NewScene = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const snack = useSnackbar();
  const router = useRouter();
  const { formState, register, handleSubmit } = useForm<TpValues>({
    resolver: zodResolver(schema),
  });

  const handleFileUpload = async (base64: string) => {
    setProducts([]);
    const res = await fetch("/api/csvupload", {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream; base64",
      },
      body: base64,
    });
    const products = (await res.json()) as Product[];
    setProducts(products);
  };

  const createShop = async (values: TpValues) => {
    const res = await fetch("/api/shop", {
      method: "PUT",
      body: JSON.stringify({
        name: values.name,
        products,
      } satisfies PutShopRequest),
    });

    if (!res.ok) {
      snack({
        key: "shop-error",
        text: "Error creating shop",
        variant: "error",
      });
      return;
    }
    snack({
      key: "shop-created",
      text: "Shop created",
      variant: "success",
    });

    const shop = (await res.json()) as Shop;
    console.log(shop);

    router.push(`/dashboard/${shop.id}/manage`);
  };

  return (
    <form id="shop-add-form" onSubmit={handleSubmit(createShop)}>
      <Section title="Name">
        <p>
          Pick a name for your shop. This will appear on the shop&apos;s
          branding
        </p>
        <div className="mt-4">
          <TextField
            registerProps={register("name")}
            errorMessage={formState.errors.name?.message}
            inputProps={{
              size: 1,
            }}
            editMode
          />
        </div>
      </Section>
      <Section title="Products">
        <p>
          Drops a .csv file containing your products. The file should include a
          name and a price for each product.
        </p>
        <SupportedShops />
        <div className="mt-4">
          <FileDrop onUpload={handleFileUpload} />
        </div>
      </Section>
      <Section title="Preview">
        <ShopPreview products={products} />
      </Section>
      <Button
        form="shop-add-form"
        type="submit"
        className="w-full"
        loading={formState.isSubmitting}
        disabled={products.length === 0 || !formState.isValid}
        variant="primary"
      >
        Done
      </Button>
    </form>
  );
};
