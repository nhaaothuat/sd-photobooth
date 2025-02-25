"use client";
import Image from "next/image";



import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
import { useDisclosure } from '@mantine/hooks';

import ChildSideBar from "./ChildSideBar";
import ButtonTest from "./ButtonTest";
const Navbar = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div className="bg-primary dark:bg-slate-700 text-white py-2 px-5 flex justify-between ">
      <div >
        <Image alt="logo" src={image} width={90} height={80} />
      </div>

      <div className="flex items-center">
        <ThemeToggle />
<ButtonTest />
        <Menu shadow="md" width={"200px"} >
          <Menu.Target >

            <Avatar className="cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="text-black">CN</AvatarFallback>
            </Avatar>


          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item onClick={open} leftSection={<IconSettings size={14} />}>
              Settings
            </Menu.Item>
            <Menu.Item leftSection={<IconMessageCircle size={14} />}>
              Messages
            </Menu.Item>
            <Menu.Item leftSection={<IconPhoto size={14} />}>
              Gallery
            </Menu.Item>
            

            {/* <Menu.Divider /> */}

            
          </Menu.Dropdown>
        </Menu>
        <Modal opened={opened} onClose={close} title="Settings" size={"50%"} centered >
          <ChildSideBar />
        </Modal>
      </div>
    </div>
  );
};

export default Navbar;
