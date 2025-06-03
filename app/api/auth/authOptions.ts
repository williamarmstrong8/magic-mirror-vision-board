import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/calendar.readonly",
            "https://www.googleapis.com/auth/tasks.readonly",
            "https://www.googleapis.com/auth/spreadsheets.readonly"
          ].join(" "),
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account, user }: { token: JWT; account: any; user: any }) {
      if (account) {
        token.accessToken = account.access_token ?? token.accessToken ?? null;
        token.refreshToken = account.refresh_token ?? token.refreshToken ?? null;
        token.expires_at = account.expires_at ?? token.expires_at ?? null;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        (session.user as any).accessToken = token.accessToken ?? null;
        (session.user as any).refreshToken = token.refreshToken ?? null;
        (session.user as any).expires_at = token.expires_at ?? null;
      }
      return session;
    },
  },
};

export default authOptions; 