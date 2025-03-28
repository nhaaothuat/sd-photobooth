"use client";
import { useState } from "react";
import {
  Icon2fa,
  IconBellRinging,
  IconDatabaseImport,
  IconFingerprint,
  IconKey,
  IconReceipt2,
  IconSettings,
} from "@tabler/icons-react";
import Profile from "./Profile";


type NavItem = {
  label: string;
  icon: React.ElementType;
  component: React.ReactNode; 
};


const navItems: NavItem[] = [
  {
    label: "Profile",
    icon: IconBellRinging,
    component: <Profile />,
  },
  {
    label: "Billing",
    icon: IconReceipt2,
    component: <div>💳 Billing Content</div>,
  },
  {
    label: "Security",
    icon: IconFingerprint,
    component: <div>🔒 Security Content</div>,
  },
  {
    label: "SSH Keys",
    icon: IconKey,
    component: <div>🔑 SSH Keys Content</div>,
  },
  {
    label: "Databases",
    icon: IconDatabaseImport,
    component: <div>🗄 Databases Content</div>,
  },
  {
    label: "Authentication",
    icon: Icon2fa,
    component: <div>✅ Authentication Content</div>,
  },
  {
    label: "Other Settings",
    icon: IconSettings,
    component: <div>⚙️ Other Settings Content</div>,
  },
];

// 🛠 Component Sidebar
const ChildSideBar = () => {
  const [active, setActive] = useState<NavItem>(navItems[1]); // Mặc định chọn "Billing"

  return (
    <div className="flex ">
      {/* Sidebar */}
      <nav className="h-[700px] w-[250px] p-4 flex flex-col border-r border-gray-300 dark:border-gray-700">
        <div className="flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center w-full text-sm font-medium px-3 py-2 rounded-md transition-all cursor-pointer 
              ${
                item.label === active.label
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setActive(item)}
            >
              <item.icon className="w-6 h-6 mr-3" stroke={1.5} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

    
      <main className="flex-1 p-3 h-screen overflow-y-auto ">
        
        <div className="mt-4 text-gray-700 dark:text-gray-300">
          {active.component}
        </div>
      </main>
    </div>
  );
};

export default ChildSideBar;
