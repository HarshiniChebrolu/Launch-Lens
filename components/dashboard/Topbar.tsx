"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, ShieldCheck, User } from "lucide-react";

export default function Topbar() {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const u = localStorage.getItem("launch_lens_user");
        if (u) {
          const parsed = JSON.parse(u);
          if (parsed.email) setUserEmail(parsed.email);
        }
      } catch (e) {}
    }
  }, []);

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80 dashboardTopbar">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider topbarEyebrow">
            Startup Decision Cockpit
          </span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight topbarHeading">
          Launch Intelligence Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 shadow-sm backdrop-blur-sm topbarSyncBadge">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="font-medium">Hybrid Workspace Sync</span>
        </div>

        {userEmail && (
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 shadow-sm topbarUserBadge">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
              <User className="h-3 w-3" />
            </div>
            <span className="truncate max-w-[140px] font-medium">{userEmail}</span>
          </div>
        )}
      </div>
    </header>
  );
}