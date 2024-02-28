import Login from "./Login";

export type PpParams = {
  searchParams: {
    callbackUrl: string;
  };
};

export default async function Page({ searchParams }: PpParams) {
  return <Login {...searchParams} />;
}
