"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import fpt from "@/assets/fpt.png";
import { usePathname } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import { Bot, Users, Settings, FileText, CreditCard } from "lucide-react";

const menuItems: Record<string, { label: string; link: string; icon: React.ElementType }[]> = {
  "/dashboard/admin": [
    { label: "Admin Dashboard", link: "/dashboard/admin", icon: Bot },
    { label: "Payment Method", link: "/dashboard/admin/payment", icon: Users },
    { label: "Type Session", link: "/dashboard/admin/type", icon: Settings },
    { label: "User", link: "/dashboard/admin/user", icon: Settings },
    
  ],
  "/dashboard/manager": [
    { label: "Manager Dashboard", link: "/dashboard/manager", icon: Bot },
    { label: "Location", link: "/dashboard/manager/location", icon: Users },
    { label: "Coupon", link: "/dashboard/manager/coupon", icon: FileText },
  ],
  "/dashboard/staff": [
    { label: "Staff Dashboard", link: "/dashboard/staff", icon: Bot },
    { label: "Customer", link: "/dashboard/staff/customer", icon: Users },
    { label: "Session Code", link: "/dashboard/staff/code", icon: FileText },
    { label: "Payment", link: "/dashboard/staff/payment", icon: CreditCard },
    { label: "Order", link: "/dashboard/staff/order", icon: CreditCard },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const currentPath = Object.keys(menuItems).find((key) => pathname.startsWith(key));
  const items = menuItems[currentPath || "/dashboard/staff"] || [];
  
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex justify-center items-center py-4">
              <Image src={fpt} width={100} height={100} alt="logo" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
                  <Link href={item.link} className="flex items-center gap-2 font-medium">
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             {/* {items.map((item) => {
              const isActive = pathname === item.link; // Check active state

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.link} 
                      className={`flex items-center gap-2 font-medium p-2 rounded-md
                        ${isActive ? "bg-blue-200 " : " "}
                      `}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })} */}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
