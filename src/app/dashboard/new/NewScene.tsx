"use client";
import { CsvUploadResponse } from "@/app/api/csvupload/route";
import Button from "@/components/Button";
import FileDrop from "@/components/FileDrop";
import Section from "@/components/Section";
import ShopPreview from "@/components/shop/ShopPreview";
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
  name: z.string({ required_error: "Shop name is required" }),
});

export const NewScene = () => {
  const [upload, setUpload] = useState<CsvUploadResponse | null>();
  const snack = useSnackbar();
  const router = useRouter();
  const { formState, register, handleSubmit } = useForm<TpValues>({
    resolver: zodResolver(schema),
  });

  const handleFileUpload = async (base64: string) => {
    setUpload(null);
    const res = await fetch("/api/csvupload", {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream; base64",
      },
      body: base64,
    });
    const upload = (await res.json()) as CsvUploadResponse;
    setUpload(upload);
  };

  const createShop = async (values: TpValues) => {
    if (!upload) {
      return;
    }

    const res = await fetch("/api/shop", {
      method: "PUT",
      body: JSON.stringify({
        id: "123",
        name: values.name,
        products: upload?.products,
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
        {upload && <ShopPreview products={upload?.products} />}
      </Section>
      <Button
        form="shop-add-form"
        type="submit"
        className="w-full"
        loading={formState.isSubmitting}
        disabled={upload?.products.length === 0 || !formState.isValid}
        variant="primary"
      >
        Done
      </Button>
    </form>
  );
};
