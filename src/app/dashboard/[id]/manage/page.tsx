import ShopScene from "@/app/dashboard/ShopScene";
import fetchAuth from "@/app/fetchAuth";
import AppScene from "@/components/AppScene";
import { Shop } from "@/model";

const Page = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const shopId = params.id;
  const shopRes = await fetchAuth(`shops/${shopId}`);
  const shop = (await shopRes.json()) as Shop;
  console.log(shop);
  return (
    <AppScene title={shop.name}>
      <ShopScene shop={shop} />
    </AppScene>
  );
};

export default Page;
