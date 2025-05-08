import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyPassword } from "@/lib/auth/password"
import { findUserByEmail } from "@/lib/auth/user-repository"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await findUserByEmail(credentials.email)

        if (!user) return null

        const isValid = await verifyPassword(credentials.password, user.passwordHash)

        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
        token.isVerified = user.isVerified
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as string,
          isVerified: token.isVerified as boolean,
        },
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
}
