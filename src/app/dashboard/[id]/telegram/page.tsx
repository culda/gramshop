import fetchAuth from "@/app/fetchAuth";
import { Shop } from "@/model";
import Scene from "./Scene";

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
  return <Scene shop={shop} />;
};

export default Page;
