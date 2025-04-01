"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
import { Bot, Users, Settings, FileText, CreditCard, ChevronUp, ChevronDown } from "lucide-react";
import fpt from "@/assets/tech-x.png";


type MenuItem = {
  label: string;
  link?: string;
  icon?: React.ElementType;
  subMenu?: { label: string; link: string }[];
};

const menuItems: Record<string, MenuItem[]> = {
  "/dashboard/admin": [
    { label: "Admin Dashboard", link: "/dashboard/admin", icon: Bot },
    { label: "Payment Method", link: "/dashboard/admin/payment", icon: Users },
    { label: "Type Session", link: "/dashboard/admin/type", icon: Settings },
    {
      label: "User", icon: Settings, subMenu: [{ label: "Test", link: "/dashboard/admin/user/test" },
        {label: "Account (Manager)", link: "/dashboard/admin/user/account-manager" },
        {label: "Account (Staff)", link: "/dashboard/admin/user/account-staff" },
      ],
    },
    { label: "Photo Style", link: "/dashboard/admin/style", icon: Settings },
    {
      label: "Settings",
      icon: FileText,
      subMenu: [{ label: "General", link: "/dashboard/admin/settings/general" },

      ],
    },
  ],
  "/dashboard/manager": [
    { label: "Manager Dashboard", link: "/dashboard/manager", icon: Bot },
    { label: "Location", link: "/dashboard/manager/location", icon: Users },
    { label: "Coupon", link: "/dashboard/manager/coupon", icon: FileText },
    {
      label: "Order",
      icon: FileText,
      subMenu: [{ label: "List Order", link: "/dashboard/manager/order/get" },
      { label: "Create Order", link: "/dashboard/manager/order/create" }
      ],
    },
    { label: "Booth", link: "/dashboard/manager/booth", icon: FileText },
    { label: "Session", link: "/dashboard/manager/session", icon: FileText },
    {
      label: "Settings",
      icon: FileText,
      subMenu: [{ label: "General", link: "/dashboard/manager/settings/general" },

      ],
    },
  ],
  "/dashboard/staff": [
    { label: "Staff Dashboard", link: "/dashboard/staff", icon: Bot },
    { label: "Customer", link: "/dashboard/staff/customer", icon: Users },
    { label: "Session Code", link: "/dashboard/staff/code", icon: FileText },
    { label: "Payment", link: "/dashboard/staff/payment", icon: CreditCard },
    { label: "Order", link: "/dashboard/staff/order", icon: CreditCard },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const currentPath = Object.keys(menuItems).find((key) => pathname.startsWith(key));
  const items = menuItems[currentPath || "/dashboard/staff"] || [];
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

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
                <SidebarMenuItem>
                  {item.link ? (
                    <SidebarMenuButton asChild >
                      <Link href={item.link} className="flex items-center font-sans font-medium gap-2 px-3 py-2 w-full">
                        {item.icon && <item.icon size={30} />}
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <button
                      className=" flex items-center justify-between font-sans font-medium text-sm w-full px-3 py-1"
                      onClick={() => toggleMenu(item.label)}
                    >
                      <div className="flex items-center gap-2 ">
                        {item.icon && <item.icon size={16} />}
                        {item.label}
                      </div>
                      {item.subMenu && (openMenus[item.label] ? <ChevronUp size={20} /> : <ChevronDown size={20} />)}
                    </button>
                  )}

                </SidebarMenuItem>

                {item.subMenu && openMenus[item.label] && (
                  <div className="ml-5 border-l my-1 border-gray-300 pl-3">
                    {item.subMenu.map((sub) => (
                      <SidebarMenuItem key={sub.label}>
                        <SidebarMenuButton asChild>
                          <Link href={sub.link} className="flex items-center gap-2 font-sans font-semibold text-sm text-gray-600 px-3 py-2">
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