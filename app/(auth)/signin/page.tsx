"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SignIn() {
  const { data: session } = useSession();

  return (
    <>
      {!session ? (
        <Button onClick={() => signIn("google", { redirectTo: "/" })}>
          Sign in with Google
        </Button>
      ) : (
        <>
          <p>Welcome, {session.user?.name}</p>
          <Button onClick={() => signOut()}>Sign out</Button>
        </>
      )}
    </>
  );
}
