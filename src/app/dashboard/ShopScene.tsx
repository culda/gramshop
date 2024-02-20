"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import TextField from "../../components/TextField";
import { getChangedProps } from "./getChangedProps";
import { Product, Shop } from "@/model";
import { useSnackbar } from "@/components/SnackbarProvider";
import Section from "@/components/Section";
import Button from "@/components/Button";
import ShopPreview from "@/components/ShopPreview";
import { FaCopy } from "react-icons/fa";

type PpShop = {
  shop: Shop;
  edit?: boolean;
};

export type TpValues = {
  botToken: string;
};

const schema = z.object({
  botToken: z.string({ required_error: "Bot token is required" }),
});

const ShopScene = ({ shop, edit = false }: PpShop) => {
  const snack = useSnackbar();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { formState, register, handleSubmit } = useForm<TpValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      botToken: shop?.botToken,
    },
  });

  const onSubmit = async ({ botToken }: TpValues) => {
    setIsLoading(true);

    try {
      const changedProps = await getChangedProps(
        {
          botToken: shop.botToken,
        },
        {
          botToken,
        }
      );

      const body = {
        id: shop.id,
        ...changedProps,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/shops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (res.status === 200) {
        snack({
          key: "shop-success",
          text: "Success",
          variant: "success",
        });
        // we don't use router because we want to force a browser refetch to get the updated page
        // not sure how to use router.push to force a refetch
        window.location.href = `${process.env.NEXT_PUBLIC_HOST}/dashboard`;
      } else {
        snack({
          key: "shop-create-failure",
          text: "Something went wrong",
          variant: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-gray-600 body-font">
      <form
        id="pageForm"
        onSubmit={handleSubmit(onSubmit)}
        className="container pt-5 mx-auto flex flex-wrap"
      >
        <Section title="Bot Token">
          <p>Enter the bot token received from BotFather.</p>
          <div className="mt-4">
            <TextField
              registerProps={register("botToken")}
              errorMessage={formState.errors.botToken?.message}
              inputProps={{
                size: 1,
              }}
              editMode={edit}
            />
          </div>
        </Section>

        <Section title="Preview">
          <ShopPreview products={shop.products} />
        </Section>

        {edit && (
          <div className="h-12 flex w-1/2 flex-row gap-2 justify-center mx-auto">
            <Button type="submit" loading={isLoading} form="pageForm">
              Save
            </Button>
            {edit && (
              <Button
                href={`/dashboard`}
                variant="text"
                type="button"
                disabled={formState.isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default ShopScene;
