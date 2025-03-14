import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import AxiosAPI from "./configs/axios";
import { DecodedJWT, ErrorResponse, TokenResponse } from "./types/token";
import { encrypt } from "./app/helpers/dataEncryption";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

async function sendTokenToBackend(idToken: string) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  try {
    const response = await AxiosAPI.post<{ Token: string }>(
      "api/Auth/google/callback",
      {
        Token: idToken,
      }
    );

    if (response.status >= 200 && response.status < 300 && response.data) {
      const dataReceive = response.data as unknown as TokenResponse;
      return dataReceive.token;
    }

    throw new Error("Failed to retrieve token");
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, account, session, user }) {
      console.log("JWT callback called", { token, trigger, account, session, user });

      console.log("xxx");
      if(trigger === 'update') {
        console.log(session);
        if(session){
          return session;
        }
      }
      if (account?.id_token) {
        token.accessToken = account.access_token;

        try {
          const access_token = await sendTokenToBackend(account.id_token);

          (await cookies()).set("AccessToken", access_token);

          const decodedJWT = jwtDecode<DecodedJWT>(access_token);

          if (decodedJWT) {
            token.id =
              decodedJWT[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
              ] || "";
            token.name =
              decodedJWT[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
              ] || "";
            token.email =
              decodedJWT[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email"
              ] || "";
            token.role =
              decodedJWT[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ] || "guest";
            token.emailVerified = decodedJWT["email_verified"] ?? null;
          }
        } catch (error) {
          console.error("An error occurred: ", error);
        }
      }

      return token;
    },

    async session({ session, trigger, token, user }) {
      console.log("SESSION callback called", { session, trigger, token, user });

      session.user = {
        id: (token.id as string) ?? null,
        name: token.name,
        email: (token.email as string) ?? null,
        role: (token.role as string) ?? null,
        emailVerified: (token.emailVerified as Date) ?? null,
      };

      console.log("xxx");

      if(trigger === 'update') {
        console.log("xxx");
        if(session){
          return session;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
