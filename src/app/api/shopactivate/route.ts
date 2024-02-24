import fetchAuth from "@/app/fetchAuth";
import { Shop } from "@/model";
import { NextRequest, NextResponse } from "next/server";
import { Telegram } from "puregram";

type ShopActivateRequest = {
  id: string;
};

export async function POST(req: NextRequest) {
  const { id } = (await req.json()) as ShopActivateRequest;

  // const shopRes = await fetchAuth(`shops/${id}`);
  // const shop = (await shopRes.json()) as Shop;

  // if (!shop.providerToken) {
  //   return NextResponse.error();
  // }

  const menuUrl = `https://${process.env.NEXT_PUBLIC_DOMAIN}/shop/${id}`;

  console.log(menuUrl);

  const telegram = Telegram.fromToken(
    "6491571682:AAFpv1_jUUF7UvZAoZmvZAiDBa0wRegrdXU" as string
  );
  telegram.api.setChatMenuButton({
    menu_button: {
      type: "web_app",
      text: "Shop Now",
      web_app: { url: menuUrl }, // URL to your web app
    },
  });

  return NextResponse.json({});
}
