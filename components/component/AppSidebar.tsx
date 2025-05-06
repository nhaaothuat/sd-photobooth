"use client";

import { useMemo, useState } from "react";
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
  Gauge,
  CreditCard,
  Layers,
  ImageDown,
  Brush,
  StickyNote,
  Shapes,
  ListOrdered,
  UserCog,
  Camera,
  Settings,
  MapPin,
  Gift,
  ShoppingCart,
  Store,
  Calendar,
  Package,
  Boxes,
  Repeat,
  User,
  IdCard,
  History,
  Badge,
  Clock,
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
    { label: "Dashboard", link: "/dashboard/admin", icon: Gauge },
    { label: "Payment Method", link: "/dashboard/admin/payment", icon: CreditCard },
    { label: "Level Membership", link: "/dashboard/admin/levelmembership", icon: Layers },
    {
      label: "Frame",
      icon: ImageDown,
      subMenu: [
        { label: "List Frame", link: "/dashboard/admin/frame/list" },
        { label: "Get by Frame Style", link: "/dashboard/admin/frame/byframe" },
      ],
    },
    { label: "Frame Style", link: "/dashboard/admin/frame-style", icon: Brush },
    {
      label: "Sticker",
      icon: StickyNote,
      subMenu: [
        { label: "List Sticker", link: "/dashboard/admin/sticker/list" },
        { label: "Get by Sticker Style", link: "/dashboard/admin/sticker/bysticker" },
      ],
    },
    { label: "Sticker Style", link: "/dashboard/admin/sticker-style", icon: Shapes },
    { label: "Type Session", link: "/dashboard/admin/type", icon: ListOrdered },
    {
      label: "User",
      icon: UserCog,
      subMenu: [
        { label: "Function", link: "/dashboard/admin/user/function" },
        { label: "Account (Manager)", link: "/dashboard/admin/user/account-manager" },
        { label: "Account (Staff)", link: "/dashboard/admin/user/account-staff" },
      ],
    },
    { label: "Photo Style", link: "/dashboard/admin/style", icon: Camera },
    {
      label: "Settings",
      icon: Settings,
      subMenu: [
        { label: "Profile", link: "/dashboard/admin/settings/profile" },
      ],
    },
  ],
  "/dashboard/manager": [
    { label: "Dashboard", link: "/dashboard/manager", icon: Gauge },
    { label: "Location", link: "/dashboard/manager/location", icon: MapPin },
    { label: "Coupon", link: "/dashboard/manager/coupon", icon: Gift },
    { label: "Order", icon: ShoppingCart, link: "/dashboard/manager/order" },
    {
      label: "Booth",
      icon: Store,
      subMenu: [
        { label: "Get Booth by Location", link: "/dashboard/manager/booth/bylocation" },
        { label: "List Booth", link: "/dashboard/manager/booth/list" },
      ],
    },
    { label: "Session", link: "/dashboard/manager/session", icon: Calendar },
    { label: "Payment Method", link: "/dashboard/manager/payment", icon: CreditCard },
    { label: "Deposit Product", link: "/dashboard/manager/deposit-product", icon: Package },
    {
      label: "TypeSession Product",
      icon: Boxes,
      subMenu: [
        { label: "TypeSession Product List", link: "/dashboard/manager/typesession-product/list" },
        { label: "Get by Coupon", link: "/dashboard/manager/typesession-product/bycoupon" },
        { label: "Get by Type Session", link: "/dashboard/manager/typesession-product/bytype" },
      ],
    },
    { label: "Transaction", link: "/dashboard/manager/transaction", icon: Repeat },
    {
      label: "User",
      icon: UserCog,
      subMenu: [
        { label: "View Detail Customer", link: "/dashboard/manager/user/detailc" },
        { label: "Account (Customer)", link: "/dashboard/manager/user/account-customer" },
        { label: "Account (Staff)", link: "/dashboard/manager/user/account-staff" },
        { label: "Ban/Unban Staff", link: "/dashboard/manager/user/func" },
      ],
    },
    {
      label: "Settings",
      icon: Settings,
      subMenu: [
        { label: "Profile", link: "/dashboard/manager/settings/profile" },
      ],
    },
  ],
  "/dashboard/staff": [
    { label: "Staff Dashboard", link: "/dashboard/staff", icon: Gauge },
    { label: "Session Code", link: "/dashboard/staff/session", icon: Calendar },
    { label: "Membership Card", link: "/dashboard/staff/membership", icon: Badge },
    { label: "Photo History", link: "/dashboard/staff/photo", icon: Clock },
    {
      label: "User",
      icon: UserCog,
      subMenu: [
        { label: "View Detail Customer", link: "/dashboard/staff/user/detailc" },
        { label: "Account (Customer)", link: "/dashboard/staff/user/account-customer" },
      ],
    },
    { label: "Order", icon: ShoppingCart, link: "/dashboard/staff/order" },
    {
      label: "Settings",
      icon: Settings,
      subMenu: [
        { label: "Profile", link: "/dashboard/staff/settings/profile" },
      ],
    },
  ],
};


export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const currentPath = useMemo(
    () => Object.keys(menuItems).find((key) => pathname.startsWith(key)),
    [pathname]
  );
  const items = useMemo(
    () => menuItems[currentPath || "/dashboard/staff"] || [],
    [currentPath]
  );
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex justify-center items-center py-4 rounded-xl shadow-lg">
              <Image src={fpt} width={150} height={150} alt="logo" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-white dark:bg-black dark:text-white shadow-xl rounded-2xl">
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <div key={item.label}>
                <SidebarMenuItem>
                  {item.link ? (
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.link}
                        className={`flex items-center font-sans font-medium gap-2 px-4 py-3 w-full rounded-lg transition-colors ${pathname === item.link
                            ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white font-semibold"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-300"
                          }`}
                      >
                        {item.icon && <item.icon size={30} />}
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <button
                      className="flex items-center justify-between font-sans font-medium text-sm w-full px-4 py-2 rounded-lg text-gray-900 dark:text-gray-300"
                      onClick={() => toggleMenu(item.label)}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon size={18} />}
                        {item.label}
                      </div>
                      {item.subMenu &&
                        (openMenus[item.label] ? (
                          <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                        ))}
                    </button>
                  )}
                </SidebarMenuItem>

                {item.subMenu && openMenus[item.label] && (
                  <div className="ml-5 border-l my-1 border-gray-300 dark:border-gray-600 pl-3">
                    {item.subMenu.map((sub) => (
                      <SidebarMenuItem key={sub.label}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={sub.link}
                            className={`flex items-center gap-2 font-sans font-semibold text-sm px-4 py-2 rounded-lg transition-colors ${pathname === sub.link
                                ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
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
