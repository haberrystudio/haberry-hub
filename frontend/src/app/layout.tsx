import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Haberry Arcade | Super Admin",
  description: "Haberry Arcade super admin dashboard",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
