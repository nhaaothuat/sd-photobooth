import React from 'react'
import { signOut } from "next-auth/react";
import { IconChevronRight } from "@tabler/icons-react";
import { Group, UnstyledButton } from "@mantine/core";

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

import image from "@/assets/fpt.png";
import ChildSideBar from './ChildSideBar';
import { useDisclosure } from '@mantine/hooks';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronsUpDown } from 'lucide-react';
import { SidebarMenuButton } from '../ui/sidebar';
import { useSession } from "next-auth/react"
const AvatarChildSideBar = () => {
     const [opened, { open, close }] = useDisclosure(false);
     const { data: session } = useSession()
     return (
          <>
               <Menu shadow="md" width={"200px"} >
                    <Menu.Target >
                         <SidebarMenuButton size="lg" className='flex items-center mx-2 cursor-pointer '>
                              <Avatar >
                                   <AvatarImage src="https://github.com/shadcn.png" />
                                   <AvatarFallback>CN</AvatarFallback>
                              </Avatar>


                              <div className="grid flex-1 text-left text-sm leading-tight mr-2">
                                   <span className="truncate font-semibold">Test</span>
                                   <span className="truncate text-xs">test@gmail.com</span>
                              </div>
                              <ChevronsUpDown className="ml-auto size-4" />
                         </SidebarMenuButton>

                    </Menu.Target>

                    <Menu.Dropdown>
                         <Menu.Label>
                              {/* <div className="flex items-center gap-2 px-1 text-left text-sm">
                                   <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                   </Avatar>


                                   <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">Test</span>
                                        <span className="truncate text-xs">test@gmail.com</span>
                                   </div>

                              </div> */}
                              Application
                         </Menu.Label>
                         <Menu.Divider />
                         <Menu.Item onClick={open} leftSection={<IconSettings size={14} />}>
                              Settings
                         </Menu.Item>
                         <Menu.Divider />
                         <Menu.Item onClick={open} leftSection={<IconSettings size={14} />}>
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
