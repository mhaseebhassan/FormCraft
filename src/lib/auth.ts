import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? (process.env.NODE_ENV === "development" ? "formcraft-local-development-secret" : undefined),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email.toLowerCase() }).lean();
        if (!user?.password) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        await connectToDatabase();
        await User.updateOne(
          { email: user.email.toLowerCase() },
          {
            $setOnInsert: {
              name: user.name ?? user.email.split("@")[0],
              email: user.email.toLowerCase(),
              image: user.image,
            },
          },
          { upsert: true },
        );
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) token.userId = user.id;
      if (!token.userId && token.email) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email.toLowerCase() }).select("_id").lean();
        if (dbUser) token.userId = dbUser._id.toString();
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? "");
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
