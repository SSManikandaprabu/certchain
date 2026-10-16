import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "certchain-super-secret-key-32-chars-long",
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
