"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Loading from "@/components/component/Loading";

const protectedRoutes: Record<string, string[]> = {
  "/dashboard/admin": ["Admin"],
  "/dashboard/manager": ["Manager"],
  "/dashboard/staff": ["Staff"],
};

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const publicRoutes = [ "/","/forget-password"];

  useEffect(() => {
    console.log(session);
    if (status === "loading") return;
    if (pathname === "/") return;

    if (publicRoutes.includes(pathname)) return;

    if (Cookies.get("AccessToken") === undefined) {
      signOut({ callbackUrl: "/" });
      return;
    }

    const matchedRoute = Object.keys(protectedRoutes).find((route) =>
      pathname.startsWith(route)
    );

    if (matchedRoute) {
      const allowedRoles = protectedRoutes[matchedRoute];

      if (!session || !allowedRoles.includes(session.user?.role || "")) {
        router.replace("/");
        return;
      }
    }
  }, [session, pathname]);

  if (status === "loading") return <Loading />;

  return <>{children}</>;
}

export default AuthWrapper;
