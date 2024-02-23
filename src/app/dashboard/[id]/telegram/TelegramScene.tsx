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
  providerToken: string;
};

const schema = z.object({
  providerToken: z.string({ required_error: "Bot token is required" }),
});

export const TelegramScene = ({ shop }: { shop: Shop }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const snack = useSnackbar();
  const router = useRouter();

  const { formState, register, handleSubmit } = useForm<TpValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      providerToken: shop?.providerToken,
    },
  });

  const onSubmit = async ({ providerToken }: TpValues) => {
    setIsLoading(true);

    try {
      await fetch("/api/shopupdate", {
        method: "POST",
        body: JSON.stringify({
          id: shop.id,
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppScene title="Payment provider">
      <form id="bot-token-form" onSubmit={handleSubmit(onSubmit)}>
        <Section title="Create your bot on Telegram">
          <p>
            Visit{" "}
            <a className="font-medium underline" href="https://t.me/botfather">
              BotFather
            </a>
            , Telegram's bot management tool, and follow the instructions to
            create a new bot.
          </p>
        </Section>
        <Section title="Set up payments">
          <p>
            Navigate to your bot settings, then to Payments, and connect a
            payment provider of your choice, such as Stripe. You'll need to
            follow the provider's setup process.
          </p>
        </Section>
        <Section title="Provider Token">
          <p>
            The provider token you just created is used to generate invoices for
            users when they checkout. Enter the token in the field below to
            complete the setup.
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
          Submit
        </Button>
      </form>
    </AppScene>
  );
};
