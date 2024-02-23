import fetchAuth from "@/app/fetchAuth";
import { Shop } from "@/model";
import { NextRequest, NextResponse } from "next/server";

type ShopActivateRequest = {
  id: string;
};

export async function POST(req: NextRequest) {
  const { id } = (await req.json()) as ShopActivateRequest;

  const shopRes = await fetchAuth(`shops/${id}`);
  const shop = (await shopRes.json()) as Shop;

  if (!shop.providerToken) {
    return NextResponse.error();
  }

  const menuUrl = `https://${process.env.NEXT_PUBLIC_DOMAIN}/shops/${id}`;
  const apiUrl = `https://api.telegram.org/bot${shop.botToken}/setBotMenuButton`;
  const requestData = {
    user_id: 0, // For all users
    button: {
      type: "web_app",
      text: "Open Web App",
      web_app: { url: "https://www.google.com" }, // URL to your web app
    },
  };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
  console.log(await res.json());

  return NextResponse.json({});
}
