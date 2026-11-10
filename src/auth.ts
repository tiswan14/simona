import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,

  providers: [
    Credentials({
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },

      async authorize(credentials) {
        try {
          if (
            typeof credentials.username !== 'string' ||
            typeof credentials.password !== 'string'
          ) {
            return null
          }

          const username = credentials.username.trim()
          const password = credentials.password

          if (!username || !password) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: {
              username,
            },
          })

          if (!user || !user.isActive) {
            return null
          }

          const isValidPassword = await bcrypt.compare(
            password,
            user.password,
          )

          if (!isValidPassword) {
            return null
          }

          const role = user.role

          if (
            role !== 'ADMIN' &&
            role !== 'PEGAWAI' &&
            role !== 'KEPALA_BPS'
          ) {
            console.error('[AUTH] Invalid user role:', role)
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role,
          }
        } catch (error) {
          console.error('[AUTH] Authorize error:', error)
          throw error
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },

  callbacks: {

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string

        const role = token.role

        if (
          role === 'ADMIN' ||
          role === 'PEGAWAI' ||
          role === 'KEPALA_BPS'
        ) {
          session.user.role = role
        }
      }

      return session
    },
  },
})