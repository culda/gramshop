import { ShopProvider } from "@/components/ShopContext";
import { ShopPlp } from "@/components/shop/ShopPlp";
import { Product, Shop } from "@/model";

const Page = async ({ params }: { params: { id: string } }) => {
  const products = await getProducts(params.id);
  console.log("loading products");
  return (
    <ShopProvider products={products}>
      <ShopPlp />
    </ShopProvider>
  );
};

async function getProducts(shopId: string): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products?shopId=${shopId}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  const data = (await res.json()) as Pick<Shop, "products">["products"];
  return data;
}

export default Page;
