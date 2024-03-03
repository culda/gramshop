"use client";
import Button from "@/components/Button";
import CurrencySelect from "@/components/CurrencySelect";
import FileDrop from "@/components/FileDrop";
import Section from "@/components/Section";
import ShopPreview from "@/components/shop/ShopPreview";
import { useSnackbar } from "@/components/SnackbarProvider";
import SupportedShops from "@/components/SupportedShops";
import TextField from "@/components/TextField";
import { PutShopRequest } from "@/functions/shop/put/handler";
import { Product, Shop, Currency, TempShop } from "@/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type TpValues = {
  name: string;
  currency: string;
};

const schema = z.object({
  name: z.string().nonempty({ message: "Shop name is required" }),
  currency: z.nativeEnum(Currency),
});

export const NewScene = ({ ts }: { ts?: TempShop }) => {
  const [upload, setUpload] = useState<TempShop | undefined>(ts);
  const snack = useSnackbar();
  const router = useRouter();
  const { formState, register, handleSubmit, getValues, watch } =
    useForm<TpValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        currency: Currency.USD,
      },
    });

  const currency = watch("currency");

  const handleFileUpload = async (base64: string) => {
    setUpload(undefined);
    const res = await fetch("/api/csvupload", {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream; base64",
      },
      body: base64,
    });
    const upload = (await res.json()) as TempShop;
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
        currency: values.currency as Currency,
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
      <Section title="Shop currency">
        <p>Enter the currency you want to use for your shop.</p>
        <div className="mt-4">
          <CurrencySelect editMode registerProps={register("currency")} />
        </div>
      </Section>
      <Section className="mt-8" title="Products">
        <p>
          Drops a .csv file containing your products. The file should include a
          name and a price for each product.
        </p>
        <SupportedShops />
        <div className="mt-4">
          <FileDrop onUpload={handleFileUpload} />
        </div>
      </Section>
      <Section className="mt-8" title="Preview">
        {upload && (
          <ShopPreview
            currency={currency as Currency}
            products={upload?.products}
          />
        )}
      </Section>
      <Button
        form="shop-add-form"
        type="submit"
        className="w-full mt-8 ml-4"
        loading={formState.isSubmitting}
        disabled={upload?.products.length === 0 || !formState.isValid}
        variant="primary"
      >
        Done
      </Button>
    </form>
  );
};
