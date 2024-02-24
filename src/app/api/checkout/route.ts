import fetchAuth from "@/app/fetchAuth";
import { Product } from "@/model";
import { NextRequest, NextResponse } from "next/server";

type PostCheckoutRequest = {
  shopId: string;
  items: Product[];
  auth: Telegram.WebApp.initDataUnsafe;
};

export async function POST(req: NextRequest) {
  const data = await req.json();
  const shopsRes = await fetchAuth("checkout", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const shop = await shopsRes.json();
  return NextResponse.json(shop);
}
