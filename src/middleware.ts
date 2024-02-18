import { withAuth } from "next-auth/middleware";

export { default } from "next-auth/middleware";

export const config = { matcher: ["/dashboard/:path*", "/dashboard"] };
// export default withAuth({
//   callbacks: {
//     authorized: async ({ token, req }) => {
//       console.log("here", token);
//       const t = req.cookies.get("next-auth.session-token")?.value;
//       const isAuthorized = !!t;
//       // TODO: check if token is valid
//       return isAuthorized;
//     },
//   },
// });
