import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import AxiosAPI from "./configs/axios";
import { TokenResponse } from "./app/types/token";
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
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      if (account?.access_token) {
        token.accessToken = account.access_token;
        try {
          const access_token = await sendTokenToBackend(account.access_token);

          (await cookies()).set("AccessToken", access_token,{
            httpOnly: true,
            sameSite: "lax",
            priority:"medium",

          });

          token.userInfo = jwtDecode(access_token);
          
        } catch (error) {
          console.error("Không thể gửi token đến backend:", error);
        }
      }

      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// export async function middleware(req: NextRequest) {
//   const token = req.cookies.get("AccessToken")?.value;
//   console.log(token);
//   if (token) {
//     return NextResponse.next();
//   }

//   const url = req.nextUrl.clone();
//   url.pathname = "/signin";
//   return NextResponse.redirect(url);
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
