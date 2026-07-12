import "./globals.css";
import type { Metadata } from "next";
import ThemeToggle from "@/components/theme/ThemeToggle";

export const metadata: Metadata = {
  title: "Launch Lens | Startup Intelligence Platform",
  description:
    "Transform startup ideas into investor-ready startup intelligence reports.",
};

const themeScript = `
(function () {
  try {
    var savedTheme = localStorage.getItem("launch-lens-theme-v2");
    var theme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : "dark";

    document.documentElement.setAttribute("data-theme", theme);
  } catch (error) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}