"use client"
// import { AppSidebar } from "@/components/component/AppSidebar";
import Navbar from "@/components/component/Navbar";
import Sidebar from "@/components/component/Sidebar";
import Trigger from "@/components/component/Trigger";
import { AppShell, Burger, Button, Group, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';


import { ThemeProvider } from "@/providers/theme-provider";


const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
    
     return (
          <ThemeProvider
               attribute="class"
               defaultTheme="system"
               enableSystem
               disableTransitionOnChange
          >

              

               <Navbar />

               <div className="flex">
                    <div className="hidden md:block h-[100vh] w-[250px] border-r   ">
                         <Trigger />
                         {/* <Sidebar /> */}
                    </div>
                    <div className="p-5 w-full md:max-w-[1140px] ">

                         {children}

                    </div>

               </div>

          </ThemeProvider>


     )
}

export default DashBoardLayout;