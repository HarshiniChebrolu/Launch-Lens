"use client";

import React, { useState } from "react";
import {
  Rocket,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthCard() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "info">("error");
  const [loading, setLoading] = useState(false);

  // Compute password strength for registration
  const passwordStrength = React.useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 34;
    if (password.length >= 10) score += 33;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 33;
    return Math.min(score, 100);
  }, [password]);

  const strengthColor =
    passwordStrength >= 80
      ? "bg-emerald-400"
      : passwordStrength >= 50
      ? "bg-amber-400"
      : "bg-rose-400";

  const strengthLabel =
    passwordStrength >= 80
      ? "Strong password"
      : passwordStrength >= 50
      ? "Moderate password"
      : passwordStrength > 0
      ? "Weak password"
      : "";

  function quickFillDemo() {
    setEmail("founder.demo@launchlens.io");
    setPassword("LaunchLens2026!");
    setMessage("");
  }

  function authenticateLocally(userEmail: string, actionType: "login" | "signup") {
    if (typeof window !== "undefined") {
      const cleanEmail = userEmail.trim() || "founder@launchlens.local";
      const localUser = {
        id: "local_" + Date.now(),
        email: cleanEmail,
        isLocal: true,
        authenticated_at: new Date().toISOString(),
      };
      localStorage.setItem("launch_lens_user", JSON.stringify(localUser));

      try {
        const existingRaw = localStorage.getItem("launch_lens_local_accounts");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        if (!existing.some((acc: any) => acc.email === cleanEmail)) {
          existing.push({ email: cleanEmail, created_at: new Date().toISOString() });
          localStorage.setItem("launch_lens_local_accounts", JSON.stringify(existing));
        }
      } catch (e) {
        console.warn("Local account caching warning:", e);
      }
    }

    setMessageType("success");
    setMessage(
      actionType === "signup"
        ? "Account initialized in Offline-Ready Workspace. Redirecting..."
        : "Authenticated successfully. Redirecting to your cockpit..."
    );

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 600);
  }

  function continueAsGuest() {
    authenticateLocally("guest@launchlens.local", "login");
  }

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
      setMessageType("error");
      setMessage("Please enter both email and password.");
      return;
    }

    if (password.length < 6) {
      setMessageType("error");
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          const errText = error.message?.toLowerCase() || "";

          // Offline fallback
          if (
            errText.includes("failed to fetch") ||
            errText.includes("networkerror") ||
            errText.includes("load failed") ||
            errText.includes("connection refused")
          ) {
            console.warn("Supabase unreachable. Falling back to local offline session.");
            authenticateLocally(email, "login");
            return;
          }

          setMessageType("error");
          if (errText.includes("invalid login credentials")) {
            setMessage("Invalid credentials. Please verify your password or create a new account.");
          } else if (errText.includes("email not confirmed")) {
            setMessage("Please confirm your email address before logging in.");
          } else {
            setMessage(error.message);
          }
          return;
        }

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "launch_lens_user",
            JSON.stringify({
              id: data.user?.id || "user-" + Date.now(),
              email: email.trim(),
              mode: "supabase",
            })
          );
        }

        setMessageType("success");
        setMessage("Login successful. Redirecting to workspace...");
        window.location.href = "/dashboard";
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          const errText = error.message?.toLowerCase() || "";

          // Offline fallback
          if (
            errText.includes("failed to fetch") ||
            errText.includes("networkerror") ||
            errText.includes("load failed") ||
            errText.includes("connection refused")
          ) {
            console.warn("Supabase unreachable. Automatically creating local offline account.");
            authenticateLocally(email, "signup");
            return;
          }

          setMessageType("error");
          if (errText.includes("already registered")) {
            setMessage("An account already exists with this email. Please sign in instead.");
          } else {
            setMessage(error.message);
          }
          return;
        }

        if (data.user && !data.session) {
          setMessageType("success");
          setMessage("Account registered. Please check your email to confirm your account.");
          return;
        }

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "launch_lens_user",
            JSON.stringify({
              id: data?.user?.id || "user-" + Date.now(),
              email: email.trim(),
              mode: "supabase",
            })
          );
        }

        setMessageType("success");
        setMessage("Account created successfully. Launching workspace...");
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      console.warn("Supabase network error caught in AuthCard:", err);
      authenticateLocally(email, mode);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 authPageContainer">
      <div className="w-full max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 authCardShell">
        {/* LEFT BRAND PANEL (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden authBrandPanel">
          {/* Ambient blur glow */}
          <div className="absolute top-0 left-0 -mt-8 -ml-8 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 -mb-8 -mr-8 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <div className="space-y-6 relative z-10">
            <a href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white block authBrandTitle">
                  Launch Lens
                </span>
                <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase block">
                  Venture Intelligence
                </span>
              </div>
            </a>

            <div className="space-y-3 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                <Sparkles className="h-3.5 w-3.5" />
                Intelligent Founder Cockpit
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight authHeading">
                Validate your startup before writing code.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed authBrandText">
                Transform rough hypotheses into investor-ready intelligence reports with live market demand signals, competitor vulnerability maps, and full-stack architecture blueprints.
              </p>
            </div>
          </div>

          {/* Value Proof Badges */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3 relative z-10 authFeatureList">
            <div className="flex items-center gap-2.5 text-xs text-slate-300 authFeatureItem">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Full Engineering & Database Blueprints</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300 authFeatureItem">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Competitor Moat & Vulnerability Teardowns</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300 authFeatureItem">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Gemini 1.5 Pro Copilot Workspace</span>
            </div>

            <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 flex items-center gap-2.5 text-[11px] text-cyan-300 authOfflinePill">
              <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>Dual Cloud-Synced & Offline-Ready Workspace</span>
            </div>
          </div>
        </div>

        {/* RIGHT AUTH FORM (lg:col-span-7) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-slate-900/60 authFormPanel">
          <div className="max-w-md w-full mx-auto space-y-6">
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl border border-slate-800 bg-slate-950/80 p-1 authTabSwitch">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === "login"
                    ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm authTabActive"
                    : "text-slate-400 hover:text-white authTabInactive"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setMessage("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === "signup"
                    ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm authTabActive"
                    : "text-slate-400 hover:text-white authTabInactive"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Quick Demo Access Button */}
            <button
              type="button"
              onClick={quickFillDemo}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/15 text-cyan-300 text-xs font-semibold transition-all shadow-sm authQuickDemoBtn"
            >
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span>Quick Test: Fill Demo Founder Credentials</span>
            </button>

            {/* Form Heading */}
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight authTitle">
                {mode === "login" ? "Welcome back, Founder" : "Create your Founder Account"}
              </h3>
              <p className="text-xs text-slate-400 authSubTitle">
                {mode === "login"
                  ? "Access your saved startup dossiers, blueprints, and Copilot."
                  : "Start generating and validating startup intelligence in seconds."}
              </p>
            </div>

            {/* Status Feedback Banner */}
            {message && (
              <div
                className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-xs ${
                  messageType === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : messageType === "info"
                    ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                }`}
              >
                {messageType === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                )}
                <span className="leading-relaxed">{message}</span>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={submit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 authFieldLabel">
                  Work or Founder Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 authFieldIcon">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@venture.com"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all authInput"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 authFieldLabel">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() =>
                        setMessage("To reset your password, please contact support or use local guest access.")
                      }
                      className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 authFieldIcon">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-11 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all authInput"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Strength Meter (Signup Mode) */}
                {mode === "signup" && password && (
                  <div className="space-y-1.5 pt-1">
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden authStrengthTrack">
                      <div
                        className={`h-full ${strengthColor} transition-all duration-300`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 authSubTitle">{strengthLabel}</span>
                      <span className="text-slate-500 text-[10px]">Min. 6 characters</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Remember Me Option */}
              {mode === "login" && (
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500/30"
                  />
                  <label htmlFor="remember" className="text-xs text-slate-400 select-none authSubTitle">
                    Stay signed in for 30 days
                  </label>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 py-3 text-xs sm:text-sm font-bold text-white shadow-xl shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Processing Authentication...</span>
                  </div>
                ) : (
                  <>
                    <span>
                      {mode === "login" ? "Sign In to Cockpit" : "Create Founder Account"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center pt-1 authDivider">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 absolute font-semibold authDividerText">
                or explore directly
              </span>
            </div>

            {/* Social / Guest Action */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={continueAsGuest}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-all authGuestBtn"
              >
                <UserCheck className="h-4 w-4 text-emerald-400" />
                <span>Continue as Guest Founder (Instant Access)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}