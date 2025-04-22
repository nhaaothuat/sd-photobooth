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
import {
  Bot,
  Users,
  Settings,
  FileText,
  CreditCard,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import fpt from "@/assets/tech-x.png";

type MenuItem = {
  label: string;
  link?: string;
  icon?: React.ElementType;
  subMenu?: { label: string; link: string }[];
};

const menuItems: Record<string, MenuItem[]> = {
  "/dashboard/admin": [
    { label: "Dashboard", link: "/dashboard/admin", icon: Bot },
    { label: "Payment Method", link: "/dashboard/admin/payment", icon: Users },
    {
      label: "Level Membership",
      link: "/dashboard/admin/levelmembership",
      icon: Users,
    },

    {
      label: "Frame",
      icon: FileText,
      subMenu: [
        { label: "List Frame", link: "/dashboard/admin/frame/list" },
        { label: "Get by Frame Style", link: "/dashboard/admin/frame/byframe" },
      ],
    },
    { label: "Frame Style", link: "/dashboard/admin/frame-style", icon: Bot },

    {
      label: "Sticker",
      icon: FileText,
      subMenu: [
        { label: "List Sticker", link: "/dashboard/admin/sticker/list" },
        {
          label: "Get by Sticker Style",
          link: "/dashboard/admin/sticker/bysticker",
        },
      ],
    },
    {
      label: "Sticker Style",
      link: "/dashboard/admin/sticker-style",
      icon: Bot,
    },
    { label: "Type Session", link: "/dashboard/admin/type", icon: Settings },
    {
      label: "User",
      icon: Settings,
      subMenu: [
        { label: "Function", link: "/dashboard/admin/user/function" },
        {
          label: "Account (Manager)",
          link: "/dashboard/admin/user/account-manager",
        },
        {
          label: "Account (Staff)",
          link: "/dashboard/admin/user/account-staff",
        },
      ],
    },
    { label: "Photo Style", link: "/dashboard/admin/style", icon: Settings },
    {
      label: "Settings",
      icon: FileText,
      subMenu: [
        { label: "Profile", link: "/dashboard/admin/settings/profile" },
      ],
    },
  ],
  "/dashboard/manager": [
    { label: "Dashboard", link: "/dashboard/manager", icon: Bot },
    { label: "Location", link: "/dashboard/manager/location", icon: Users },
    { label: "Coupon", link: "/dashboard/manager/coupon", icon: FileText },

    {
      label: "Order",
      icon: FileText,
      link: "/dashboard/manager/order",
    },

    {
      label: "Booth",
      icon: FileText,
      subMenu: [
        {
          label: "Get Booth by Location",
          link: "/dashboard/manager/booth/bylocation",
        },
        { label: "List Booth", link: "/dashboard/manager/booth/list" },
      ],
    },
    { label: "Session", link: "/dashboard/manager/session", icon: FileText },
    {
      label: "Payment Method",
      link: "/dashboard/manager/payment",
      icon: FileText,
    },
    {
      label: "Deposit Product",
      link: "/dashboard/manager/deposit-product",
      icon: FileText,
    },
    // { label: "TypeSession Product", link: "/dashboard/manager/typesession-product", icon: FileText },
    {
      label: "TypeSession Product",
      icon: FileText,
      subMenu: [
        {
          label: "TypeSession Product List",
          link: "/dashboard/manager/typesession-product/list",
        },
        {
          label: "Get by Coupon",
          link: "/dashboard/manager/typesession-product/bycoupon",
        },
        {
          label: "Get by Type Session",
          link: "/dashboard/manager/typesession-product/bytype",
        },
      ],
    },
    {
      label: "Transaction",
      link: "/dashboard/manager/transaction",
      icon: FileText,
    },
    {
      label: "User",
      icon: Settings,
      subMenu: [
        {
          label: "View Detail Customer",
          link: "/dashboard/manager/user/detailc",
        },

        {
          label: "Account (Customer)",
          link: "/dashboard/manager/user/account-customer",
        },
        {
          label: "Account (Staff)",
          link: "/dashboard/manager/user/account-staff",
        },
      ],
    },
    {
      label: "Settings",
      icon: FileText,
      subMenu: [
        { label: "Profile", link: "/dashboard/manager/settings/profile" },
      ],
    },
  ],
  "/dashboard/staff": [
    { label: "Staff Dashboard", link: "/dashboard/staff", icon: Bot },
    { label: "Session Code", link: "/dashboard/staff/session", icon: FileText },
    {
      label: "Membership Card",
      link: "/dashboard/staff/membership",
      icon: CreditCard,
    },
    { label: "Photo History", link: "/dashboard/staff/photo", icon: Users },
    {
      label: "User",
      icon: Settings,
      subMenu: [
        {
          label: "View Detail Customer",
          link: "/dashboard/staff/user/detailc",
        },

        {
          label: "Account (Customer)",
          link: "/dashboard/staff/user/account-customer",
        },
      ],
    },

    {
      label: "Order",
      icon: FileText,
      link: "/dashboard/staff/order",
    },
    {
      label: "Settings",
      icon: FileText,
      subMenu: [
        { label: "Profile", link: "/dashboard/staff/settings/profile" },
      ],
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const currentPath = Object.keys(menuItems).find((key) =>
    pathname.startsWith(key)
  );
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
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.link}
                        className={`flex items-center font-sans font-medium gap-2 px-3 py-2 w-full rounded-md transition-colors ${
                          pathname === item.link
                            ? "bg-gray-100 text-primary font-semibold"
                            : "hover:bg-gray-50"
                        }`}
                      >
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
                      {item.subMenu &&
                        (openMenus[item.label] ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        ))}
                    </button>
                  )}
                </SidebarMenuItem>

                {item.subMenu && openMenus[item.label] && (
                  <div className="ml-5 border-l my-1 border-gray-300 pl-3">
                    {item.subMenu.map((sub) => (
                      <SidebarMenuItem key={sub.label}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={sub.link}
                            className={`flex items-center gap-2 font-sans font-semibold text-sm px-3 py-2 rounded-md transition-colors ${
                              pathname === sub.link
                                ? "bg-gray-100 text-primary"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
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
