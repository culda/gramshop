// utils/authenticatedFetch.js

import { cookies } from "next/headers";

async function fetchAuth(path: string, options: RequestInit = {}) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("next-auth.session-token")?.value;

  // Ensure headers object exists
  if (!options.headers) options.headers = {};

  // Add the Cookie header if the session token exists
  if (sessionToken) {
    Object.assign(options.headers, {
      Cookie: `next-auth.session-token=${sessionToken}`,
    });
  }

  // Perform the fetch request with the authentication cookie included
  return await fetch(`${process.env.API_ENDPOINT}/${path}`, options);
}

export default fetchAuth;
