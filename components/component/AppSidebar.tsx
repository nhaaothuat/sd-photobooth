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
import fpt from "@/assets/tech-x.png";
import { usePathname } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import { Bot, Users, Settings, FileText, CreditCard, icons } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho menu
type  MenuItem = {
  label: string;
  link: string;
  icon?: React.ElementType;
  subMenu?: { label: string; link: string; icon?: React.ElementType }[];
};

const menuItems: Record<string, MenuItem[]> = {
  "/dashboard/admin": [
    { label: "Admin Dashboard", link: "/dashboard/admin", icon: Bot },
    { label: "Payment Method", link: "/dashboard/admin/payment", icon: Users },
    { label: "Type Session", link: "/dashboard/admin/type", icon: Settings },
    { label: "User", link: "/dashboard/admin/user", icon: Settings },
    { label: "Photo Style", link: "/dashboard/admin/style", icon: Settings },
  ],
  "/dashboard/manager": [
    { label: "Manager Dashboard", link: "/dashboard/manager", icon: Bot },
    { label: "Location", link: "/dashboard/manager/location", icon: Users },
    { label: "Coupon", link: "/dashboard/manager/coupon", icon: FileText },
    {
      label: "Order",
      link: "/dashboard/manager/order",
      icon: FileText,
      subMenu: [
       
        { label: "List Order", link: "/dashboard/manager/order/get", icon:Bot},
      ],
    },
    { label: "Booth", link: "/dashboard/manager/booth", icon: FileText },
    { label: "Session", link: "/dashboard/manager/session", icon: FileText },
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
              <Image src={fpt} width={150} height={150} alt="logo" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <div key={item.label}>
                {/* Menu chính */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href={item.link} className="flex items-center gap-2 font-medium">
                      {item.icon && <item.icon size={20} />}
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Kiểm tra và hiển thị subMenu nếu có */}
                {item.subMenu && (
                  <div className="ml-6">
                    {item.subMenu.map((sub) => (
                      <SidebarMenuItem key={sub.label}>
                        <SidebarMenuButton asChild>
                          <Link href={sub.link} className="flex items-center gap-2 text-sm font-normal text-gray-600">
                            {sub.icon && <sub.icon size={20} />}
                             {sub.label}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
