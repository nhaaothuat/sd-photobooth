"use client";

import * as React from "react";

import { useTheme } from "next-themes";



import { ActionIcon, Group } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme(); // Lấy theme từ ShadCN
  const [mounted, setMounted] = React.useState(false);

  // Đảm bảo theme chỉ render trên client (fix lỗi hydration Next.js)
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Tránh lỗi flash trên server-side rendering

  return (
    
 
    <Group justify="center">
      <ActionIcon className="h-8 w-8"
        variant="light"
        
        aria-label="Toggle color scheme"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? <IconSun stroke={1.5} /> : <IconMoon stroke={1.5} />}
      </ActionIcon>
    </Group>
  
  );
}
