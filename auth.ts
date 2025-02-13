import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import { API_BASE_URL } from "@/lib/apiHome";

const validateEnvVars = () => {
  if (!process.env.ENCRYPTION_KEY || !process.env.ENCRYPTION_IV) {
    throw new Error("Encryption key or IV is not set in environment variables.");
  }
};

// Utility to encrypt a token
const encryptToken = async (token: string) => {
  validateEnvVars();
  const encoder = new TextEncoder();
  const key = Buffer.from(process.env.ENCRYPTION_KEY, "utf-8").slice(0, 16);
  const iv = Buffer.from(process.env.ENCRYPTION_IV, "utf-8").slice(0, 16);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );

  const data = encoder.encode(token);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    cryptoKey,
    data
  );

  return Buffer.from(encrypted).toString("hex");
};

// Utility to decrypt a token
const decryptToken = async (encryptedToken: string) => {
  validateEnvVars();
  const decoder = new TextDecoder();
  const key = Buffer.from(process.env.ENCRYPTION_KEY, "utf-8").slice(0, 16);
  const iv = Buffer.from(process.env.ENCRYPTION_IV, "utf-8").slice(0, 16);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );

  const encryptedData = Buffer.from(encryptedToken, "hex");
  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    cryptoKey,
    encryptedData
  );

  return decoder.decode(decryptedData);
};

// Function to send token to the backend
async function sendTokenToBackend(accessToken: string) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Disable SSL verification for development
  try {
    const encryptedAccessToken = await encryptToken(accessToken);
    const response = await fetch(
      "https://sdphotobooth.azurewebsites.net/api/Auth/callback/google",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Token: encryptedAccessToken }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to exchange token with backend: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Token received from backend:", data);
    return data;
  } catch (error) {
    console.error("Error sending token to backend:", error);
    throw error;
  }
}

export const { handlers, signIn, signOut, auth } =
  // NextAuth({
  //   providers: [
  //     Google({
  //       clientId: process.env.GOOGLE_CLIENT_ID,
  //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //       // authorization:{
  //       //   params: {
  //       //     redirect_uri: 'https://sdphotobooth.azurewebsites.net/api/Auth/callback/google'
  //       //   }
  //       // }
  //     }),
  //   ],
  //   callbacks: {
  //     jwt({ token, account, user }) {
  //       if (user) {
  //         // Gắn thông tin người dùng vào token
  //         token.id = user.id;
  //         token.email = user.email;
  //       }

  //       if (account?.access_token) {
  //         // Gắn access token từ provider (nếu có) vào token
  //         token.accessToken = account.access_token;
  //       }

  //       // console.log("JWT Token:", token);
  //       return token;
  //     },
  //     session({ session, token }) {
  //       session.user.id = token.id as string;
  //       return session;
  //     },
  //   },
  //   secret: process.env.NEXTAUTH_SECRET,
  // });

  NextAuth({
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization:{
          params: {
            redirect_uri: 'https://sdphotobooth.azurewebsites.net/api/Auth/callback/google'
          }
        }
      }),
    ],
    callbacks: {
      async jwt({ token, account, user }) {
        if (user) {
          token.id = user.id;
          token.email = user.email;
        }
        console.log("user nhận được từ Google:", token);

        if (account?.access_token) {
          token.accessToken = account.access_token;
          try {
            await sendTokenToBackend(account.access_token);
          } catch (error) {
            console.error("Không thể gửi token đến backend:", error);
          }
        }

        return token;
      },
      async session({ session, token }) {
        session.user.id = token.id;
        if (token.accessToken) {
          try {
            await sendTokenToBackend(token.accessToken);
          } catch (error) {
            console.error("Không thể gửi token đến backend:", error);
          }
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

export async function middleware(req: NextRequest) {
  
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token) {
    return NextResponse.next(); // Cho phép truy cập
  }

  const url = req.nextUrl.clone();
  url.pathname = "/signin";
  return NextResponse.redirect(url);
}
