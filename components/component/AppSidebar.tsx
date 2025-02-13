"use client"
// import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { usePathname } from "next/navigation";

const menuItems: { [key: string]: { label: string; link: string }[] } = {
  "/dashboard/admin": [
    { label: "Admin Dashboard", link: "/dashboard/admin" },
    { label: "Manage Users", link: "/dashboard/admin/manage-users" },
    { label: "Settings", link: "/dashboard/admin/settings" },
  ],
  "/dashboard/manager": [
    { label: "Manager Dashboard", link: "/dashboard/manager" },
    { label: "Team", link: "/dashboard/manager/team" },
    { label: "Reports", link: "/dashboard/manager/reports" },
  ],
  "/dashboard/staff": [
    { label: "Staff Dashboard", link: "/dashboard/staff" },
    { label: "Customer", link: "/dashboard/staff/customer" },
    { label: "Code", link: "/dashboard/staff/code" },
    { label: "Payment", link: "/dashboard/staff/payment" },
  ],
};


export function AppSidebar() {
  const pathname = usePathname();
  const currentPath = Object.keys(menuItems).find((key) => pathname.startsWith(key));
  const items = menuItems[currentPath || "/dashboard/staff"] || [];
  return (
    <Sidebar>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.link}>
                  <SidebarMenuButton asChild>
                    <a href={item.link}>
                      {/* Thêm icon ở đây nếu cần */}
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  )
}
