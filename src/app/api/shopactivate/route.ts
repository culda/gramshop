import fetchAuth from "@/app/fetchAuth";
import { Shop } from "@/model";
import { NextRequest, NextResponse } from "next/server";
import { Telegram } from "puregram";

type ShopActivateRequest = {
  id: string;
};

export async function POST(req: NextRequest) {
  const { id } = (await req.json()) as ShopActivateRequest;
  const shopRes = await fetchAuth(`shops/${id}`);
  const shop = (await shopRes.json()) as Shop;

  if (!shop.active && !shop.activationRequested) {
    await fetchAuth("shops", {
      method: "POST",
      body: JSON.stringify({
        id: shop.id,
        activationRequested: true,
      }),
    });
  }

  if (!shop.active) {
    return NextResponse.json({ message: "Activation requested" });
  }

  if (!shop.botToken) {
    return NextResponse.json({ error: "Bot token required" }, { status: 400 });
  }

  const menuUrl = `https://${process.env.NEXT_PUBLIC_DOMAIN}/shop/${id}`;
  const telegram = Telegram.fromToken(shop.botToken);
  telegram.api.setChatMenuButton({
    menu_button: {
      type: "web_app",
      text: "Shop Now",
      web_app: { url: menuUrl },
    },
  });

  return NextResponse.json({ message: "Menu button set" });
}
