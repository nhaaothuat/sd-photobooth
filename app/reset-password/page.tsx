import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GalleryVerticalEnd } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ResetPasswordPage = () => {
     return (
          <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
               <div className="flex w-full max-w-sm flex-col gap-6">
                    <a href="#" className="flex items-center gap-2 self-center font-medium">
                         <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                              <GalleryVerticalEnd className="size-4" />
                         </div>
                         Acme Inc.
                    </a>
                    <div className="flex flex-col gap-6" >
                         <Card>
                              <CardHeader className="text-center">
                                   <CardTitle className="text-xl">Welcome back</CardTitle>
                                   <CardDescription>
                                        Login with your Apple or Google account
                                   </CardDescription>
                              </CardHeader>
                              <CardContent>
                                   <form>
                                        <div className="grid gap-6">


                                             <div className="grid gap-6">
                                                  <div className="grid gap-2">

                                                       <Label htmlFor="password">Password</Label>


                                                       <Input id="password" type="password" required />
                                                  </div>
                                                  <div className="grid gap-2">

                                                       <Label htmlFor="password">Confirm Password</Label>


                                                       <Input id="password" type="password" required />
                                                  </div>
                                                  <Button type="submit" className="w-full">
                                                       Update Password
                                                  </Button>
                                             </div>
                                             <div className="text-center text-sm">
                                                  You already have an account?{" "}
                                                  <Link href="/" className="underline underline-offset-4">
                                                       Sign In
                                                  </Link>
                                             </div>
                                        </div>
                                   </form>
                              </CardContent>
                         </Card>

                    </div>
               </div>
          </div>
     )
}

export default ResetPasswordPage
