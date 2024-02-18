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
      sameSite: "Lax",
      path: "/",
      domain: "localhost",
      secure: false,
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

export const config = {
  cookies,
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Credentials({
    //   id: "email",
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" },
    //     platformLogin: { label: "Platform Login", type: "text" },
    //     resetCode: { label: "Reset Code", type: "text" },
    //   },
    //   authorize: async (credentials) => {
    //     if (!credentials) return Promise.reject("no credentials");
    //     const res = await fetch(`${process.env.API_ENDPOINT}/login`, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         email: credentials.email,
    //         password: credentials.password,
    //         resetCode: credentials.resetCode,
    //         platformLogin: credentials.platformLogin === "true" ? true : false,
    //       }),
    //     });

    //     const user = await res.json();

    //     // Check if the response is successful and has a user
    //     if (res.ok && user) {
    //       return user;
    //     }

    //     throw new Error(user.message);
    //   },
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      // session.accessToken = await encode({
      //   token,
      //   secret: Buffer.from(process.env.NEXTAUTH_SECRET as string),
      // });

      // Attach user details from the JWT token to the session
      if (token.user) {
        session.user = token.user;
      }

      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.user = user; // Attach user details to the JWT token
      }
      return token;
    },
  },
} satisfies NextAuthOptions;

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
