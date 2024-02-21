import fetchAuth from "@/app/fetchAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const shopsRes = await fetchAuth("shops", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const shop = await shopsRes.json();
  return NextResponse.json(shop);
}
