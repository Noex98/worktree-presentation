import type { Metadata } from "next";
import "./globals.css";
import { Barlow_Condensed, Crimson_Pro, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
// Stand-in for IMPACT's Flama Condensed, which is licensed and not on Google Fonts.
const condensed = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-condensed" });
// Stand-in for IMPACT's Plantin, used for intros and leads, like the italic copy on impactcommerce.com.
const serif = Crimson_Pro({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Worktrees",
  description: "Git worktrees, a bare root, and orchestration",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, condensed.variable, serif.variable)}>
      <body>{children}</body>
    </html>
  );
}
