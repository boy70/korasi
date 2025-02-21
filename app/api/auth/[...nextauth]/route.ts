import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { query } from "../../../../lib/db"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

// Session timeout settings
const sessionTimeout = 60 * 60 // 1 hour in seconds


export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: sessionTimeout,
  },
  providers: [

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        let users
        try {
          users = await query("SELECT * FROM users WHERE email = ?", [credentials.email]) as any[]
        } catch (error) {
          console.error('Database query error:', error)
          throw new Error('Database connection error. Please try again later.')
        }


        if (users.length === 0) {
          throw new Error("No user found with this email")
        }

        const user = users[0]
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: Boolean(user.is_admin),
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).isAdmin = token.isAdmin
      }
      return session
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
