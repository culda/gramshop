import fetchAuth from "@/app/fetchAuth";
import AppScene from "@/components/AppScene";
import { Shop } from "@/model";
import { ManageScene } from "./ManageScene";

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
  return (
    <AppScene title={shop.name}>
      <ManageScene shop={shop} />
    </AppScene>
  );
};

export default Page;
