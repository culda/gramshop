import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { CookiesOptions, NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const cookies: Partial<CookiesOptions> = {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      path: "/",
      domain:
        process.env.NODE_ENV === "production" ? "gramshop.co" : "localhost",
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
  },
  callbackUrl: {
    name: `next-auth.callback-url`,
    options: {},
  },
  csrfToken: {
    name: "next-auth.csrf-token",
    options: {},
  },
};

export const config: NextAuthOptions = {
  cookies,
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // authorization: {
      //   params: {
      //     request_uri: GOOGLE_AUTHORIZATION_URL,
      //     access_type: "offline",
      //     prompt: "consent",
      //   },
      // },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.user = user; // Attach user details to the JWT token
      }

      if (!token.exp || (token.exp && Date.now() < token.exp * 1000)) {
        return token;
      }

      throw new Error("Bad Token");
    },
    signIn: async ({ user, account, profile }) => {
      const token = account?.id_token;

      try {
        const res = await fetch(`${process.env.API_ENDPOINT}/login`, {
          method: "POST",
          body: JSON.stringify({
            user,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.error(err);
        return false;
      }
    },
  },
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
