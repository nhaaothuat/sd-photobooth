"use client";

import { ThemeToggle } from "@/components/component/Theme-Toggle";


import ButtonTest from "./ButtonTest";
import AvatarChildSideBar from "./AvatarChildSideBar";
const Navbar = () => {
 
  return (



    <div className="flex justify-between items-center gap-5">
      <ThemeToggle />
      <ButtonTest />
      <AvatarChildSideBar />
    </div>

  );
};

export default Navbar;
