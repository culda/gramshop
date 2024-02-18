import { redirect } from "next/navigation";
import Login from "./Login";
import { auth } from "../api/auth/[...nextauth]/auth";

export type PpParams = {
  searchParams: {
    callbackUrl: string;
  };
};

export default async function Page({ searchParams }: PpParams) {
  const session = await auth();
  if (session?.accessToken) {
    return redirect(searchParams.callbackUrl ?? "/dashboard");
  }
  return <Login {...searchParams} />;
}
