"use client"
import {
     Command,
     CommandDialog,
     CommandEmpty,
     CommandGroup,
     CommandInput,
     CommandItem,
     CommandList,
     CommandSeparator,

} from "@/components/ui/command";
import Link from "next/link";
import {
     LayoutDashboard,

} from "lucide-react";
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

const Sidebar = () => {
     const pathname = usePathname();
     const currentPath = Object.keys(menuItems).find((key) => pathname.startsWith(key));
     const items = menuItems[currentPath || "/dashboard/staff"] || [];
     return (
          <Command className="rounded-none">
               <CommandInput placeholder="Type a command or search..." />
               <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Features">
                         {items.map((item) => (
                              <CommandItem key={item.link} >
                                   <LayoutDashboard className="mr-2 h-4 w-4" />

                                   <Link href={item.link}>{item.label}</Link>
                              </CommandItem>
                         ))}


                    </CommandGroup>
                    <CommandSeparator />
                    {/* <CommandGroup heading="Settings">
                         <CommandItem>
                              <User className="mr-2 h-4 w-4" />
                              <span>Profile</span>
                         </CommandItem>
                         <CommandItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              <span>Billing</span>
                         </CommandItem>
                         <CommandItem>
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Settings</span>
                         </CommandItem>
                    </CommandGroup> */}
               </CommandList>
          </Command>
     );
};

export default Sidebar;
