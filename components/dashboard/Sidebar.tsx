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
  | "dashboard"
  | "history"
  | "reports"
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
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    label: "Dashboard",
    mode: "dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "New Idea",
    mode: "wizard",
    icon: PlusCircle,
  },
  {
    label: "Reports",
    mode: "reports",
    icon: Archive,
  },
  {
    label: "Market",
    mode: "market",
    icon: LineChart,
  },
  {
    label: "Competitors",
    mode: "competitors",
    icon: Briefcase,
  },
  {
    label: "Blueprint",
    mode: "blueprint",
    icon: Layers3,
  },
  {
    label: "Pitch",
    mode: "pitch",
    icon: Rocket,
  },
  {
    label: "Research Papers",
    mode: "research",
    icon: BookOpen,
  },
  {
    label: "Settings",
    mode: "settings",
    icon: Settings,
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
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Sign out remote warning:", e);
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("launch_lens_user");
    }

    router.replace("/auth");
    router.refresh();
  }

  return (
    <aside className="w-[268px] shrink-0 border-r border-slate-800/80 bg-slate-950/90 p-5 flex flex-col justify-between sticky top-0 h-screen overflow-y-auto backdrop-blur-xl z-30 dashboardSidebar">
      <div className="space-y-6">
        {/* Brand Header */}
        <a href="/" className="flex items-center gap-3 px-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white block sidebarLogo">
              Launch Lens
            </span>
            <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase block">
              Cockpit v2.0
            </span>
          </div>
        </a>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = mode === item.mode;
            return (
              <button
                key={item.label}
                onClick={() => setMode(item.mode)}
                className={`flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm sidebarItemActive"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 sidebarItem"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? "text-cyan-400" : "text-slate-500"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="pt-4 border-t border-slate-800/80 sidebarLogoutBorder">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors sidebarLogoutBtn"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}