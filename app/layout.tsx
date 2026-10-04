import type { Metadata } from "next";
import "./globals.css";
import { Barlow_Condensed, Source_Serif_4 } from "next/font/google";
import { cn } from "@/lib/utils";

// Stand-ins for IMPACT's licensed fonts, for wherever the real ones aren't installed (see globals.css).
// Barlow Condensed is close to Flama Condensed Medium in width and weight, and Source Serif to Plantin.
const flama = Barlow_Condensed({ subsets: ["latin"], weight: "600", variable: "--font-flama" });
const plantin = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-plantin",
});

export const metadata: Metadata = {
  title: "Worktrees",
  description: "Git worktrees, a bare root, and orchestration",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-serif", flama.variable, plantin.variable)}>
      <body>{children}</body>
    </html>
  );
}
