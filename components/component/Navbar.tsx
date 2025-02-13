"use client";
import Image from "next/image";
import Link from "next/link";
// import image from "@/assets/fpt.png";

import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/component/Theme-Toggle";
import { Button } from "../ui/button";
import image from "@/assets/fpt.png";
const Navbar = () => {
  return (
    <div className="bg-primary dark:bg-slate-700 text-white py-2 px-5 flex justify-between ">
      <div >
        <Image alt="logo" src={image} width={90} height={80} />
      </div>

      <div className="flex items-center">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar>
              {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
              <AvatarFallback className="text-black">CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"/profile"}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/"}>
                <Button onClick={() => signOut()}>Sign Out</Button>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
