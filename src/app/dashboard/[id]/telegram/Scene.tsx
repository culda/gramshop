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
};

const schema = z.object({
  botToken: z.string({ required_error: "Bot token is required" }),
});

const Scene = ({ shop }: { shop: Shop }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const snack = useSnackbar();
  const router = useRouter();

  const { formState, register, handleSubmit } = useForm<TpValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      botToken: shop?.botToken,
    },
  });

  const onSubmit = async ({ botToken }: TpValues) => {
    setIsLoading(true);

    try {
      await fetch("/api/shopupdate", {
        method: "POST",
        body: JSON.stringify({
          id: shop.id,
          botToken,
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
    <AppScene title="Connect a Telegram bot">
      <form id="bot-token-form" onSubmit={handleSubmit(onSubmit)}>
        <Section title="Bot Token">
          <p>Enter the bot token received from BotFather.</p>
          <div className="mt-4">
            <TextField
              registerProps={register("botToken")}
              errorMessage={formState.errors.botToken?.message}
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
          Done
        </Button>
      </form>
    </AppScene>
  );
};

export default Scene;
