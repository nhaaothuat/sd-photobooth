import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import AxiosAPI from "./configs/axios";
import { DecodedJWT, TokenResponse } from "./types/token";
import { encrypt } from "./app/helpers/dataEncryption";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";




async function sendTokenToBackend(accessToken: string) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  try {
    const encryptedAccessToken = await encrypt(accessToken);
    const response = await AxiosAPI.post<{ Token: string }>(
      "api/Auth/google/callback",
      {
        Token: encryptedAccessToken,
      }
    );

    if (response.status !== 200) {
      throw new Error(
        "Failed to exchange token with backend: ${response.statusText}"
      );
    }

    const dataReceive = response.data as unknown as TokenResponse;

    return dataReceive.token;
  } catch (error) {
    console.error("Error sending token to backend:", error);
    throw error;
  }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // console.log("Access Token from Google:", account?.access_token);
      if (account?.access_token) {
        token.accessToken = account.access_token;

        try {
          const access_token = await sendTokenToBackend(account.access_token);
         
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
          console.error("Cannot send token to backend:", error);
        }
      }

      return token;
    },

    async session({ session, token, user }) {
      session.user = {
        id: (token.id as string) ?? null,
        name: token.name,
        email: (token.email as string) ?? null,
        role: (token.role as string) ?? null,
        emailVerified: (token.emailVerified as Date) ?? null,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
