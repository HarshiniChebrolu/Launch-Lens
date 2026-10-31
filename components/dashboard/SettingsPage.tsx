"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  User,
  Sliders,
  Bell,
  Cpu,
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  Check,
  Save,
  Moon,
  Sun,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type SettingsTab = "profile" | "appearance" | "security" | "services" | "data";

export default function SettingsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile State
  const [founderName, setFounderName] = useState("Founder");
  const [email, setEmail] = useState("founder@launchlens.local");
  const [startupRole, setStartupRole] = useState("Founder & CEO");
  const [companyName, setCompanyName] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  // Appearance State
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("dark");
  const [defaultTab, setDefaultTab] = useState("Overview");
  const [compactDensity, setCompactDensity] = useState(false);

  // Security State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<"success" | "error" | "">("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Data & Preferences State
  const [autoSaveReports, setAutoSaveReports] = useState(true);
  const [exportFormat, setExportFormat] = useState("PDF");
  const [dataMessage, setDataMessage] = useState("");

  // Load existing profile & preferences on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load user
      try {
        const storedUser = localStorage.getItem("launch_lens_user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed.email) setEmail(parsed.email);
        }
      } catch (e) {}

      // Load profile
      try {
        const storedProfile = localStorage.getItem("launch_lens_profile");
        if (storedProfile) {
          const p = JSON.parse(storedProfile);
          if (p.founderName) setFounderName(p.founderName);
          if (p.startupRole) setStartupRole(p.startupRole);
          if (p.companyName) setCompanyName(p.companyName);
        }
      } catch (e) {}

      // Load theme
      const savedTheme = localStorage.getItem("launch-lens-theme-v2") as "dark" | "light" | null;
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      } else {
        const htmlTheme = document.documentElement.getAttribute("data-theme") as "dark" | "light" | null;
        if (htmlTheme) setCurrentTheme(htmlTheme);
      }

      // Load preferences
      const savedPref = localStorage.getItem("launch_lens_preferences");
      if (savedPref) {
        try {
          const pr = JSON.parse(savedPref);
          if (pr.defaultTab) setDefaultTab(pr.defaultTab);
          if (typeof pr.compactDensity === "boolean") setCompactDensity(pr.compactDensity);
          if (typeof pr.autoSaveReports === "boolean") setAutoSaveReports(pr.autoSaveReports);
        } catch (e) {}
      }
    }
  }, []);

  function handleSaveProfile() {
    if (typeof window !== "undefined") {
      const profile = { founderName, startupRole, companyName };
      localStorage.setItem("launch_lens_profile", JSON.stringify(profile));
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    }
  }

  function handleThemeChange(newTheme: "dark" | "light") {
    setCurrentTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("launch-lens-theme-v2", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  }

  function handleSavePreferences() {
    if (typeof window !== "undefined") {
      const prefs = { defaultTab, compactDensity, autoSaveReports, exportFormat };
      localStorage.setItem("launch_lens_preferences", JSON.stringify(prefs));
      setDataMessage("Preferences saved successfully.");
      setTimeout(() => setDataMessage(""), 2500);
    }
  }

  async function updatePassword() {
    setPasswordMessage("");
    setPasswordStatus("");

    if (newPassword.length < 6) {
      setPasswordStatus("error");
      setPasswordMessage("Password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus("error");
      setPasswordMessage("Passwords do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordStatus("error");
        setPasswordMessage(error.message);
        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setPasswordStatus("success");
      setPasswordMessage("Password updated successfully.");
    } catch (e: any) {
      setPasswordStatus("error");
      setPasswordMessage(e?.message || "Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  }

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

  function clearWorkspaceCache() {
    const confirmed = window.confirm(
      "Are you sure you want to clear your local workspace cache? This will reset offline draft states."
    );
    if (!confirmed) return;

    if (typeof window !== "undefined") {
      localStorage.removeItem("launch_lens_local_reports");
      setDataMessage("Local workspace cache purged.");
      setTimeout(() => setDataMessage(""), 3000);
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* 1. Header */}
      <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
            <Sliders className="h-3.5 w-3.5" />
            Workspace Controls
          </span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
            Active Session
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Manage your founder profile, theme appearance, AI service connections, and security credentials.
        </p>
      </div>

      {/* 2. Main Layout with Vertical Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-2.5 shadow-xl space-y-1">
          {[
            { id: "profile", label: "Profile & Identity", icon: User },
            { id: "appearance", label: "Appearance & Theme", icon: Moon },
            { id: "security", label: "Account & Security", icon: ShieldCheck },
            { id: "services", label: "Connected Services", icon: Cpu },
            { id: "data", label: "Data & Storage", icon: Bell },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as SettingsTab)}
                className={`flex items-center gap-2.5 w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800/80 mt-2">
            <button
              onClick={logout}
              className="flex items-center gap-2.5 w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-7 shadow-xl space-y-6">
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Founder Profile & Workspace Identity
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your identity details appear on generated intelligence reports and export covers.
                </p>
              </div>

              {profileSaved && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Profile updated successfully.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Founder Name
                  </label>
                  <input
                    type="text"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full rounded-xl border border-slate-800/60 bg-slate-950/30 px-3.5 py-2.5 text-xs sm:text-sm text-slate-400 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-500">
                    Managed by authentication session
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Primary Role / Title
                  </label>
                  <input
                    type="text"
                    value={startupRole}
                    onChange={(e) => setStartupRole(e.target.value)}
                    placeholder="e.g. Technical Founder, Product Lead"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Default Venture / Company
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Stealth AI Labs"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveProfile}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Appearance & Interface Preferences
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customize theme modes and dashboard density.
                </p>
              </div>

              {dataMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{dataMessage}</span>
                </div>
              )}

              {/* Theme Selector */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300">
                  Color Mode
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                      currentTheme === "dark"
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500"
                        : "border-slate-800 bg-slate-950/50 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    <span>Dark Theme</span>
                  </button>

                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                      currentTheme === "light"
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500"
                        : "border-slate-800 bg-slate-950/50 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    <span>Light Theme</span>
                  </button>
                </div>
              </div>

              {/* Default Tab Selection */}
              <div className="space-y-2 max-w-sm">
                <label className="text-xs font-semibold text-slate-300">
                  Default Report Landing Module
                </label>
                <select
                  value={defaultTab}
                  onChange={(e) => setDefaultTab(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Overview">Overview & Scorecards</option>
                  <option value="Executive">Executive Summary</option>
                  <option value="Market">Market Growth & Signals</option>
                  <option value="Blueprint">Technical Launch Blueprint</option>
                  <option value="Competitors">Competitor Intelligence</option>
                  <option value="Pitch">Pitch Deck & Script</option>
                </select>
              </div>

              {/* Compact Density Toggle */}
              <div className="flex items-center justify-between max-w-md pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    High-Density Tables
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Render compact spacing for deep matrix comparisons
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={compactDensity}
                  onChange={(e) => setCompactDensity(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSavePreferences}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT & SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Account Credentials & Authentication
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update password or manage your current session safely.
                </p>
              </div>

              {passwordMessage && (
                <div
                  className={`flex items-center gap-2 rounded-xl border p-3 text-xs ${
                    passwordStatus === "success"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                  }`}
                >
                  {passwordStatus === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                  )}
                  <span>{passwordMessage}</span>
                </div>
              )}

              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/60 pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={updatePassword}
                  disabled={passwordLoading || !newPassword}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 transition-all"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{passwordLoading ? "Updating Password..." : "Change Password"}</span>
                </button>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                  Danger Zone
                </span>
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-rose-200">
                      Purge Local Workspace Cache
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Removes offline cached reports and resets local draft states.
                    </p>
                  </div>
                  <button
                    onClick={clearWorkspaceCache}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear Cache</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONNECTED SERVICES */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Connected AI & Cloud Services
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live connection status of external models and databases powering LaunchLens.
                </p>
              </div>

              <div className="space-y-3">
                {/* Gemini AI */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        Google Gemini 1.5 Pro
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Startup intelligence reasoning & report generation engine
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </span>
                </div>

                {/* Tavily Search */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <RefreshCw className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        Tavily Web Intelligence
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Live competitor scraping and market signal indexing
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Connected
                  </span>
                </div>

                {/* Supabase Database */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        Supabase PostgreSQL & Auth
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Cloud persistent storage with offline fallback architecture
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-400">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    Active / Synced
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DATA & STORAGE */}
          {activeTab === "data" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Data Persistence & Export
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure local sync intervals and default document output.
                </p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Auto-Save Reports
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Automatically persist newly generated reports to database
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSaveReports}
                    onChange={(e) => setAutoSaveReports(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <label className="text-xs font-semibold text-slate-300">
                    Preferred Export Target
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="PDF">Investor PDF Document (Standard)</option>
                    <option value="JSON">Raw JSON Intelligence Schema</option>
                  </select>
                </div>

                <button
                  onClick={handleSavePreferences}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}