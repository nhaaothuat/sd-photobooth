import React from 'react'
import { signOut, useSession } from "next-auth/react";

import { CiLogout } from "react-icons/ci";
import { ThemeToggle } from "@/components/component/Theme-Toggle";
import { Menu, Text, Modal } from '@mantine/core';
import {
     IconSettings,
     IconSearch,
     IconPhoto,
     IconMessageCircle,
     IconTrash,
     IconArrowsLeftRight,
} from '@tabler/icons-react';
import { useRouter } from "next/navigation";
// import image from "@/assets/fpt.png";
import ChildSideBar from './ChildSideBar';
import Cookies from "js-cookie";
import { useDisclosure } from '@mantine/hooks';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronsUpDown } from 'lucide-react';
import { SidebarMenuButton } from '../ui/sidebar';

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
               <Menu  shadow="md" width={"200px"} >
                    <Menu.Target  >
                         <SidebarMenuButton size="lg" className='flex items-center mx-2 cursor-pointer '>
                              <Avatar >
                                   <AvatarImage src="https://github.com/shadcn.png" />
                                   <AvatarFallback>{session?.user.name}</AvatarFallback>
                              </Avatar>


                              <div className="grid flex-1 text-left text-sm leading-tight mr-2">
                                   <span className="truncate font-semibold">{session?.user.name ?? session?.user.email}</span>
                                   <span className="truncate text-xs">{session?.user.role}</span>
                              </div>
                              <ChevronsUpDown className="ml-auto size-4" />
                         </SidebarMenuButton>

                    </Menu.Target>

                    <Menu.Dropdown>
                         <Menu.Label>
                             
                              Application
                         </Menu.Label>
                         {/* <Menu.Divider /> */}
                         <Menu.Item onClick={open} leftSection={<IconSettings size={14} />}>
                              Settings
                         </Menu.Item>
                         <Menu.Item onClick={open} leftSection={<IconSettings size={14} />}>
                              Settings
                         </Menu.Item>
                         <Menu.Item onClick={open} leftSection={<IconSettings size={14} />}>
                              Settings
                         </Menu.Item>
                         <Menu.Divider />
                         <Menu.Item className='font-medium' onClick={handleLogout} leftSection={<CiLogout size={14} />}>
                              Log out
                         </Menu.Item>





                    </Menu.Dropdown>
               </Menu>
               <Modal opened={opened} onClose={close} title="Settings" size={"50%"} centered >
                    <ChildSideBar />
               </Modal>
          </>
     )
}

export default AvatarChildSideBar
