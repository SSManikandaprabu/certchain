import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "certchain-super-secret-key-32-chars-long",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Institute Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@institute.edu" },
        password: { label: "Password", type: "password" },
        instituteName: { label: "Institute Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        // Basic validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("Please enter a valid institute email address.");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }

        // Demo test error simulation for testing invalid credentials
        if (email === "invalid@example.com") {
          throw new Error("Invalid institute credentials. Access denied.");
        }

        // Extract institute domain/name
        const domain = email.split("@")[1] || "institute.edu";
        const instituteFromDomain = domain.split(".")[0].toUpperCase() + " Credentials";

        return {
          id: "inst_" + Math.random().toString(36).substring(2, 9),
          name: credentials.instituteName || instituteFromDomain,
          email: email,
          image: null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        // @ts-expect-error Custom id augmentation
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
};
