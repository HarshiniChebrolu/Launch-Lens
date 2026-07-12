"use client";

import { Rocket, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="logo">
        <span className="logoIcon">
          <Rocket size={20} />
        </span>
        <span>Launch Lens</span>
      </div>

      <div className="navLinks">
        <a href="#features">Features</a>
        <a href="#workflow">Workflow</a>
        <a href="#preview">Preview</a>
        <a href="#start">Start</a>
      </div>

      <div className="navActions">
        <a className="ghostBtn" href="/auth">Login</a>
        <a className="primaryBtn" href="/auth">Get Started</a>
      </div>

      <button className="menuBtn">
        <Menu size={22} />
      </button>
    </nav>
  );
}