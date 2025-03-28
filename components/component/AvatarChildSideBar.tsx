import React from 'react'
import { signOut, useSession } from "next-auth/react";

import { CiLogout } from "react-icons/ci";

import { Menu, Text, Modal,ScrollArea } from '@mantine/core';
import {
     IconSettings,
     IconSearch,
     IconPhoto,
     IconMessageCircle,
     IconTrash,
     IconArrowsLeftRight,
} from '@tabler/icons-react';
import { useRouter } from "next/navigation";

import ChildSideBar from './ChildSideBar';
import Cookies from "js-cookie";

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { ChevronsUpDown } from 'lucide-react';
import { SidebarMenuButton } from '../ui/sidebar';

import { useDisclosure } from '@mantine/hooks';


const AvatarChildSideBar = () => {
     const [opened, { open, close }] = useDisclosure(false);
     const { data: session } = useSession();
     const router = useRouter();

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
                              <Avatar >
                                   <AvatarImage src="https://github.com/shadcn.png" />

                              </Avatar>


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
                         {/* <Menu.Item onClick={open} leftSection={<IconSettings size={14} />}>
                              Settings
                         </Menu.Item>




                         <Menu.Divider /> */}
                         <Menu.Item className='font-sans font-light' onClick={handleLogout} leftSection={<CiLogout size={14} />}>
                              Log out
                         </Menu.Item>





                    </Menu.Dropdown>
               </Menu>
               <Modal opened={opened} onClose={close} size="xl" fullScreen  title="Settings" centered >
                    <ChildSideBar />
               </Modal>

          </>
     )
}

export default AvatarChildSideBar
