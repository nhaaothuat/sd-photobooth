"use client";
// import { AppSidebar } from "@/components/component/AppSidebar";
import Navbar from "@/components/component/Navbar";
// import Sidebar from "@/components/component/Sidebar";
// import Trigger from "@/components/component/Trigger";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ThemeProvider } from "@/providers/theme-provider";
import { AppSidebar } from "@/components/component/AppSidebar";
import AuthWrapper from "@/hocs/auth-wrapper";


const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <div className="ml-auto">
              {" "}
              <Navbar />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {children}

            {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default DashBoardLayout;
