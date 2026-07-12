import { Rocket } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerBrand">
        <div className="logo">
          <span className="logoIcon">
            <Rocket size={20} />
          </span>
          <span>Launch Lens</span>
        </div>

        <p>
          Startup intelligence platform for founders, students and builders who
          want to validate before they build.
        </p>
      </div>

      <div className="footerLinks">
        <a href="#features">Features</a>
        <a href="#workflow">Workflow</a>
        <a href="#preview">Preview</a>
        <a href="/auth">Login</a>
      </div>

      <div className="footerBottom">
        <span>© 2026 Launch Lens. Built for startup builders.</span>
      </div>
    </footer>
  );
}