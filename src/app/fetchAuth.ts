// utils/authenticatedFetch.js

import { cookies } from "next/headers";

async function fetchAuth(url: string, options: RequestInit = {}) {
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
  return await fetch(url, options);
}

export default fetchAuth;
