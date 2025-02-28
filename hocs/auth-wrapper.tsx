"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const protectedRoutes: Record<string, string[]> = {
  "/dashboard/admin": ["Admin"],
  "/dashboard/manager": ["Manager"],
  "/dashboard/staff": ["Staff"],
};

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

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

  if (status === "loading") return <p>Loading...</p>;

  return <>{children}</>;
}

export default AuthWrapper;
