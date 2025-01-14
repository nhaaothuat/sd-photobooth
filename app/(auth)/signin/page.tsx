
"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
 
export default function SignIn() {
  return <Button onClick={() => signIn("google",{redirectTo:"/"})}>Hello</Button>
}
