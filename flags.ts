import { flag } from "flags/next"

// Off for visitors, on locally. Override it for yourself in production with the Vercel Toolbar's
// Flags Explorer.
export const showSlides = flag<boolean>({
  key: "show-slides",
  description: "Show the slides on the site",
  defaultValue: false,
  options: [
    { value: false, label: "Hidden" },
    { value: true, label: "Visible" },
  ],
  decide() {
    return process.env.NODE_ENV === "development"
  },
})
