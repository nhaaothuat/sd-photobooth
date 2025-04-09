"use client"
import React, { useEffect, useState } from 'react'
import {
     Card,
     CardContent,
     CardDescription,
     CardFooter,
     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import {
     Avatar,
     AvatarFallback,
     AvatarImage,
} from "@/components/ui/avatar"
import { Text } from '@mantine/core';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useSession } from 'next-auth/react';
import AxiosAPI from '@/configs/axios';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



const GeneralPage = () => {

     return (
          <div className='flex   flex-col-2 gap-4'>
               <Card className="w-[350px]">
                    <CardHeader>
                         <CardTitle>Change Password</CardTitle>
                         <CardDescription>Deploy your new project in one-click.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <form>
                              <div className="grid w-full items-center gap-4">
                                   <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder="Name of your project" />
                                   </div>
                                   <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="framework">Framework</Label>
                                        <Select>
                                             <SelectTrigger id="framework">
                                                  <SelectValue placeholder="Select" />
                                             </SelectTrigger>
                                             <SelectContent position="popper">
                                                  <SelectItem value="next">Next.js</SelectItem>
                                                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                                                  <SelectItem value="astro">Astro</SelectItem>
                                                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                                             </SelectContent>
                                        </Select>
                                   </div>
                              </div>
                         </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                         <Button variant="outline">Cancel</Button>
                         <Button>Deploy</Button>
                    </CardFooter>
               </Card>
               <Card className="w-[350px]">
                    <CardHeader>
                         <CardTitle>Create project</CardTitle>
                         <CardDescription>Deploy your new project in one-click.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <form>
                              <div className="grid w-full items-center gap-4">
                                   <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder="Name of your project" />
                                   </div>
                                   <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="framework">Framework</Label>
                                        <Select>
                                             <SelectTrigger id="framework">
                                                  <SelectValue placeholder="Select" />
                                             </SelectTrigger>
                                             <SelectContent position="popper">
                                                  <SelectItem value="next">Next.js</SelectItem>
                                                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                                                  <SelectItem value="astro">Astro</SelectItem>
                                                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                                             </SelectContent>
                                        </Select>
                                   </div>
                              </div>
                         </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                         <Button variant="outline">Cancel</Button>
                         <Button>Deploy</Button>
                    </CardFooter>
               </Card>
          </div>
     )
}

export default GeneralPage
