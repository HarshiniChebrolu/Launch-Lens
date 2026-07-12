"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Trash2,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function updatePassword() {
    setMessage("");

    if (newPassword.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setMessage("Password changed successfully.");
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace("/auth");
    router.refresh();
  }

  async function deleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );

    if (!confirmed) return;

    setMessage(
      "Account deletion requires a secure server-side admin route. This action is not enabled yet."
    );
  }

  return (
    <section className="settingsPage">
      <div className="settingsHeading">
        <span className="wizardBadge">
          <ShieldCheck size={16} />
          Account Security
        </span>

        <h1>Security settings</h1>
        <p>Change your password or manage your account session.</p>
      </div>

      {message && <div className="settingsNotice">{message}</div>}

      <div className="settingsSingleGrid">
        <article className="settingsCard">
          <div className="settingsCardHeader">
            <ShieldCheck size={25} />
            <h2>Change Password</h2>
          </div>

          <label className="settingsInputGroup">
            <span>New Password</span>

            <div className="settingsPasswordBox">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Minimum 6 characters"
              />

              <button
                type="button"
                className="passwordEyeButton"
                onClick={() => setShowPassword((current) => !current)}
                aria-label="Show or hide password"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </label>

          <label className="settingsInputGroup">
            <span>Confirm New Password</span>

            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat new password"
            />
          </label>

          <button
            className="settingsPrimaryButton"
            onClick={updatePassword}
            disabled={loading}
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </article>

        <article className="settingsCard">
          <div className="settingsCardHeader">
            <LogOut size={25} />
            <h2>Session</h2>
          </div>

          <p className="settingsDescription">
            Sign out safely from your Launch Lens account.
          </p>

          <button className="settingsSecondaryButton" onClick={logout}>
            <LogOut size={17} />
            Logout
          </button>
        </article>

        <article className="settingsCard dangerSettingsCard">
          <div className="settingsCardHeader">
            <Trash2 size={25} />
            <h2>Delete Account</h2>
          </div>

          <p className="settingsDescription">
            Permanently delete your account and saved reports.
          </p>

          <button className="dangerSettingsButton" onClick={deleteAccount}>
            <Trash2 size={17} />
            Delete Account
          </button>
        </article>
      </div>
    </section>
  );
}