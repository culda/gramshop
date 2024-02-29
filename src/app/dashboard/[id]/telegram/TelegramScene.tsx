"use client";
import AppScene from "@/components/AppScene";
import { useSnackbar } from "@/components/SnackbarProvider";
import { Shop } from "@/model";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Section from "@/components/Section";
import TextField from "@/components/TextField";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { PostShopRequest } from "@/functions/shop/post/handler";

export type TpValues = {
  botToken: string;
  providerToken: string;
};

const schema = z.object({
  botToken: z.string({ required_error: "Bot token is required" }),
  providerToken: z.string({ required_error: "Bot token is required" }),
});

export const TelegramScene = ({ shop }: { shop: Shop }) => {
  const snack = useSnackbar();
  const router = useRouter();

  const { formState, register, handleSubmit } = useForm<TpValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      providerToken: shop?.providerToken,
    },
  });

  const onSubmit = async ({ providerToken, botToken }: TpValues) => {
    try {
      await fetch("/api/shopupdate", {
        method: "POST",
        body: JSON.stringify({
          id: shop.id,
          botToken,
          providerToken,
        } satisfies PostShopRequest),
      });
      snack({
        key: "shop-success",
        text: "Success",
        variant: "success",
      });
      router.push(`/dashboard/${shop.id}/manage`);
      return;
    } catch (err) {
      snack({
        key: "shop-create-failure",
        text: "Something went wrong",
        variant: "error",
      });
    }
  };

  return (
    <AppScene title="Tokens">
      <form id="bot-token-form" onSubmit={handleSubmit(onSubmit)}>
        <Section title="Create your bot on Telegram">
          <p>
            Visit{" "}
            <a className="font-medium underline" href="https://t.me/botfather">
              BotFather
            </a>
            , Telegram&apos;s bot management tool, and follow the instructions
            to create a new bot.
          </p>
        </Section>
        <Section title="Set up payments">
          <p>
            Open your bot settings, go to Payments, and connect a payment
            provider of your choice, such as Stripe. You&apos;ll need to follow
            the provider&apos;s setup process.
          </p>
        </Section>
        <Section title="Bot Token">
          <p>
            The bot token is used to validate incoming checkout requests from
            your users on our servers.
          </p>
          <div className="mt-4">
            <TextField
              registerProps={register("botToken")}
              errorMessage={formState.errors.botToken?.message}
              defaultValue={shop.botToken}
              editMode
            />
          </div>
        </Section>
        <Section title="Provider Token">
          <p>
            The provider token is used to generate invoices for users when they
            checkout.
          </p>
          <div className="mt-4">
            <TextField
              registerProps={register("providerToken")}
              errorMessage={formState.errors.providerToken?.message}
              defaultValue={shop.providerToken}
              editMode
            />
          </div>
        </Section>
        <Button
          form="bot-token-form"
          type="submit"
          className="w-full"
          loading={formState.isSubmitting}
          disabled={!formState.isValid}
          variant="primary"
        >
          Update
        </Button>
      </form>
    </AppScene>
  );
};
