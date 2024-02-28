import { ShopProvider } from "@/components/shop/ShopContext";
import { ShopPlp } from "@/components/shop/ShopPlp";
import { Shop } from "@/model";

export type PublicShopResponse = Pick<Shop, "products" | "currency">;

const Page = async ({ params }: { params: { id: string } }) => {
  const shop = await getShopPublic(params.id);
  return (
    <ShopProvider
      currency={shop.currency}
      products={shop.products}
      id={params.id}
    >
      <ShopPlp />
    </ShopProvider>
  );
};

async function getShopPublic(shopId: string): Promise<PublicShopResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/public/shop?id=${shopId}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch shop");
  }
  const data = (await res.json()) as PublicShopResponse;
  return data;
}

export default Page;
