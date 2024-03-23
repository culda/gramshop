import { Shop } from "@/model";
import fetchAuth from "../fetchAuth";
import AppScene from "@/components/AppScene";
import Button from "@/components/Button";
import { isFalseyOrEmptyArray } from "@/utils";
import { FaArrowRight } from "react-icons/fa";

export default async function Page() {
  const shopsRes = await fetchAuth("shops");
  if (!shopsRes.ok) {
    return <h1>Failed to load shops</h1>;
  }
  const shops = (await shopsRes.json()) as Shop[];

  return (
    <AppScene title="Dashboard">
      <div className="flex flex-col gap-2 mt-8">
        <h2 className="font-bold title-font text-gray-900 mb-1 text-xl">
          Shops
        </h2>
        {isFalseyOrEmptyArray(shops) && (
          <h2>You don&apos;t have any shops yet. </h2>
        )}

        {!isFalseyOrEmptyArray(shops) &&
          shops.map((shop) => (
            <Button
              variant={"secondary"}
              key={shop.id}
              href={`/dashboard/${shop.id}/manage`}
            >
              {shop.name}
            </Button>
          ))}
        <Button href={`/dashboard/new`}>
          <div className="flex flex-row gap-2 items-center">
            New Shop
            <FaArrowRight />
          </div>
        </Button>
      </div>
    </AppScene>
  );
}
