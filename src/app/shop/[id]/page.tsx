import { ShopProvider } from "@/components/ShopContext";
import ShopPlp from "@/components/ShopPlp";
import { Product } from "@/model";

const Page = async ({ params }: { params: { id: string } }) => {
  const products = await getProducts(params.id);
  console.log("loading products");
  return (
    <ShopProvider products={products}>
      <ShopPlp />
    </ShopProvider>
  );
};

async function getProducts(shopId: string) {
  const res = await fetch(
    `https://r8r37qb7jd.execute-api.us-east-1.amazonaws.com/products?shopId=${shopId}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  const data = (await res.json()) as Product[];
  return data;
}

export default Page;
