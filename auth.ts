import NextAuth from "next-auth";
import { getToken } from "next-auth/jwt";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    jwt({ token, account, user }) {
      if (user) {
        // Gắn thông tin người dùng vào token
        token.id = user.id;
        token.email = user.email;
      }

      if (account?.access_token) {
        // Gắn access token từ provider (nếu có) vào token
        token.accessToken = account.access_token;
      }
      

      console.log("JWT Token:", token); // Hiển thị toàn bộ JWT token trong console
      return token;
    },
     session({ session, token }) {
       session.user.id = token.id
       return session
     },
  },
  secret:process.env.NEXTAUTH_SECRET,
});
