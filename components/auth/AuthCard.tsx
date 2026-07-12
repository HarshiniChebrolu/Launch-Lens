"use client";

import { useState } from "react";
import { Rocket, ArrowRight, Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthCard() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [loading, setLoading] = useState(false);

  async function submit() {
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
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setMessageType("error");

          if (
            error.message.toLowerCase().includes("invalid login credentials")
          ) {
            setMessage(
              "Account not found or password is incorrect. Please create an account if you have not registered."
            );
          } else if (
            error.message.toLowerCase().includes("email not confirmed")
          ) {
            setMessage("Please confirm your email before logging in.");
          } else {
            setMessage(error.message);
          }

          return;
        }

        window.location.href = "/dashboard";
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          setMessageType("error");

          if (
            error.message.toLowerCase().includes("already registered")
          ) {
            setMessage(
              "An account already exists with this email. Please login instead."
            );
          } else {
            setMessage(error.message);
          }

          return;
        }

        if (data.user && !data.session) {
          setMessageType("success");
          setMessage(
            "Account created. Please check your email and confirm your account before logging in."
          );
          return;
        }

        setMessageType("success");
        setMessage("Account created successfully. Redirecting...");
        window.location.href = "/dashboard";
      }
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode((current) => (current === "login" ? "signup" : "login"));
    setMessage("");
    setPassword("");
  }

  return (
    <section className="authShell">
      <div className="authVisual">
        <div className="logo">
          <span className="logoIcon">
            <Rocket size={20} />
          </span>
          <span>Launch Lens</span>
        </div>

        <h1>Your startup cockpit starts here.</h1>

        <p>
          Login or create an account to save reports, compare ideas and build
          your startup blueprint.
        </p>
      </div>

      <div className="authCard">
        <span className="authBadge">
          {mode === "login" ? "Welcome back" : "Create account"}
        </span>

        <h2>{mode === "login" ? "Login" : "Register"}</h2>

        {message && (
          <div className={`authMessage ${messageType}`}>
            <p>{message}</p>

            {mode === "login" &&
              messageType === "error" &&
              message.toLowerCase().includes("create an account") && (
                <button type="button" onClick={switchMode}>
                  Create Account
                </button>
              )}
          </div>
        )}

        <label className="authField">
          <span>Email</span>

          <div>
            <Mail size={18} />

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </label>

        <label className="authField">
          <span>Password</span>

          <div>
            <Lock size={18} />

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  submit();
                }
              }}
            />
          </div>
        </label>

        <button
          className="authSubmit"
          onClick={submit}
          disabled={loading}
        >
          {loading
            ? mode === "login"
              ? "Logging in..."
              : "Creating account..."
            : mode === "login"
              ? "Login"
              : "Create Account"}

          {!loading && <ArrowRight size={18} />}
        </button>

        <button
          type="button"
          className="switchAuth"
          onClick={switchMode}
        >
          {mode === "login"
            ? "Not registered yet? Create an account"
            : "Already registered? Login"}
        </button>
      </div>
    </section>
  );
}