"use client";

import {
  LayoutDashboard,
  PlusCircle,
  Archive,
  LineChart,
  Briefcase,
  Layers3,
  Rocket,
  Settings,
  LogOut,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export type DashboardMode =
  | "history"
  | "wizard"
  | "market"
  | "competitors"
  | "blueprint"
  | "pitch"
  | "research"
  | "settings";

const menu: {
  label: string;
  mode: DashboardMode;
  icon: React.ReactNode;
}[] = [
  {
    label: "Dashboard",
    mode: "history",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "New Idea",
    mode: "wizard",
    icon: <PlusCircle size={18} />,
  },
  {
    label: "Reports",
    mode: "history",
    icon: <Archive size={18} />,
  },
  {
    label: "Market",
    mode: "market",
    icon: <LineChart size={18} />,
  },
  {
    label: "Competitors",
    mode: "competitors",
    icon: <Briefcase size={18} />,
  },
  {
    label: "Blueprint",
    mode: "blueprint",
    icon: <Layers3 size={18} />,
  },
  {
    label: "Pitch",
    mode: "pitch",
    icon: <Rocket size={18} />,
  },
  {
  label: "Research Papers",
  mode: "research",
  icon: <BookOpen size={18} />,
},
  {
    label: "Settings",
    mode: "settings",
    icon: <Settings size={18} />,
  },
];

export default function Sidebar({
  mode,
  setMode,
}: {
  mode: DashboardMode;
  setMode: (mode: DashboardMode) => void;
}) {
  const router = useRouter();

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    router.replace("/auth");
    router.refresh();
  }

  return (
    <aside className="sidebar">
      <div className="logo sidebarLogo">
        <span className="logoIcon">
          <Rocket size={20} />
        </span>

        <span>Launch Lens</span>
      </div>

      <div className="sideMenu">
        {menu.map((item) => (
          <button
            key={item.label}
            className={`sideItem ${mode === item.mode ? "active" : ""}`}
            onClick={() => setMode(item.mode)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <button className="sideItem logout" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}