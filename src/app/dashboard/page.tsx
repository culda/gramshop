import { Shop } from "@/model";
import { auth } from "../api/auth/[...nextauth]/auth";
import ShopScene from "./ShopScene";
import fetchAuth from "../fetchAuth";

export default async function Page() {
  const session = await auth();

  const shopsRes = await fetchAuth(
    `${process.env.API_ENDPOINT}/shops?id=${session?.user.id}`
  );

  const shops = (await shopsRes.json()) as Shop[];
  console.log(shops);

  return (
    <header className="w-full mb-6">
      <h1 className="text-gray-900 text-3xl title-font font-bold mb-4 thick-underline">
        Dashboard
      </h1>
      <ShopScene products={[]} shop={shops[0]} />
    </header>
  );
}
