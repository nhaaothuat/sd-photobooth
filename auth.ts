import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import Google from "next-auth/providers/google";


const encryptToken = async (token: string) => {
  const encoder = new TextEncoder();
  const key = encoder.encode(process.env.ENCRYPTION_KEY);
  const iv = encoder.encode(process.env.ENCRYPTION_IV);

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

const decryptToken = async (encryptedToken: string) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const key = encoder.encode(process.env.ENCRYPTION_KEY);
  const iv = encoder.encode(process.env.ENCRYPTION_IV);

  if (!key || !iv) {
    throw new Error(
      "Encryption key or IV is not set in environment variables."
    );
  }

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

async function sendTokenToBackend(accessToken: string) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Disable SSL verification for development
  try {
    const encryptedAccessToken = await encryptToken(accessToken);
    console.log("Encrypted token:", encryptedAccessToken);
    const response = await fetch(
      "https://sdphotobooth.azurewebsites.net/api/Auth/google/callback",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Token: encryptedAccessToken }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to exchange token with backend: ${response.statusText}"
      );
    }

    const data = await response.json();
    console.log("Token received from backend:", data);
    return data;
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
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token) {
    return NextResponse.next(); 
  }

  const url = req.nextUrl.clone();
  url.pathname = "/signin";
  return NextResponse.redirect(url);
}