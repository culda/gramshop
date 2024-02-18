import { auth } from "../api/auth/[...nextauth]/auth";
import ShopScene from "./ShopScene";

export default async function Page() {
  const session = await auth();

  //   const pagesRes = await fetch(`${process.env.API_ENDPOINT}/pages`, {
  //     headers: {
  //       Authorization: `Bearer ${session?.accessToken}`,
  //       ContentType: "application/json",
  //     },
  //     cache: "no-cache",
  //   });

  //   const userRes = await fetch(`${process.env.API_ENDPOINT}/user`, {
  //     headers: {
  //       Authorization: `Bearer ${session?.accessToken}`,
  //       ContentType: "application/json",
  //     },
  //   });
  //   const user = (await userRes.json()) as StUser;

  //   let stripeData;

  //   if (isProd() && user.creatorStripeAccountId) {
  //     stripeData = await fetchStripeData(user.creatorStripeAccountId);
  //   } else if (!isProd()) {
  //     stripeData = getFakeRevenueData();
  //   }

  return (
    <header className="w-full mb-6">
      <h1 className="text-gray-900 text-3xl title-font font-bold mb-4 thick-underline">
        Dashboard
      </h1>
      <ShopScene products={[]} shop={{}} />
    </header>
  );
}
