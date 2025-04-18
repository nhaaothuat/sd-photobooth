"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { signOut, useSession } from "next-auth/react";

import { CiLogout } from "react-icons/ci";

import { Menu, Text, Modal, ScrollArea } from '@mantine/core';
// import {
//      IconSettings,
//      IconSearch,
//      IconPhoto,
//      IconMessageCircle,
//      IconTrash,
//      IconArrowsLeftRight,
// } from '@tabler/icons-react';
import { useRouter } from "next/navigation";


import Cookies from "js-cookie";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronsUpDown } from 'lucide-react';
import { SidebarMenuButton } from '../ui/sidebar';


import AxiosAPI from '@/configs/axios';
interface User {
     avatar: string | null;
}

const AvatarChildSideBar = () => {
    
     const { data: session } = useSession();
     const router = useRouter();
     const [user, setUser] = useState<User | null>(null);

     const fetchUsers = useCallback(async () => {
          try {
               const response = await AxiosAPI.get<User>("/api/Identity/profile");
               setUser(response.data);
          } catch (err) {
               console.error("Lỗi API:", err);
          }
     }, []);

     useEffect(() => {
          fetchUsers();
     }, [fetchUsers]);

     const handleLogout = async () => {
          Cookies.remove("AccessToken");
          await signOut({ redirect: false });
          router.replace("/");
     };

     return (
          <>
               <Menu shadow="md" width={"200px"}  >
                    <Menu.Target  >
                         <SidebarMenuButton size="lg" className='flex items-center mx-2 cursor-pointer  '>
                              {user && (
                                   <Avatar >
                                        <AvatarImage src={user.avatar || undefined} />
                                        <AvatarFallback>CN</AvatarFallback>
                                   </Avatar>
                              )}



                              <div className="grid flex-1 text-left text-sm leading-tight mr-2">

                                   <Text size="sm" className='font-sans dark:text-slate-400' fw={500}>
                                        {session?.user?.name}
                                   </Text>

                              </div>
                              <ChevronsUpDown className="ml-auto size-4 dark:text-slate-300" />
                         </SidebarMenuButton>

                    </Menu.Target>

                    <Menu.Dropdown className='dark:bg-slate-800'>
                         <Menu.Label>

                              <div style={{ flex: 1 }}>
                                   <Text size="sm" className='font-sans' fw={500}>
                                        {session?.user?.name}
                                   </Text>

                                   <Text c="dimmed" size="xs">
                                        {session?.user?.role}
                                   </Text>
                              </div>
                         </Menu.Label>
                         <Menu.Divider />
                        
                         <Menu.Item className='font-sans font-light' onClick={handleLogout} leftSection={<CiLogout size={14} />}>
                              Log out
                         </Menu.Item>





                    </Menu.Dropdown>
               </Menu>
              
          </>
     )
}

export default AvatarChildSideBar
