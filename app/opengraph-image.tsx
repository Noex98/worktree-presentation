import { ImageResponse } from "next/og"
import { IMPACT_LOGO_PATH } from "@/components/impact-logo"

// The link preview, laid out like the front page's black panel: the logo top left, the headline at the
// bottom with Worktrees in yellow.
export const alt = "Git Worktrees and Agent Orchestration"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const TEXT = "GIT WORKTREES AND AGENT ORCHESTRATION"

// The licensed Flama can't ship here, so this uses its stand-in, Barlow Condensed, fetched at build time
// with only the glyphs the headline needs.
async function barlow() {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&text=${encodeURIComponent(TEXT)}`,
  ).then((res) => res.text())
  const url = css.match(/src: url\((.+?)\) format/)![1]
  return fetch(url).then((res) => res.arrayBuffer())
}

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 64, background: "#000", color: "#fff", fontFamily: "Barlow" }}>
        <svg viewBox="0 0 158.88 20.76" width={190} height={25} fill="#fff">
          <path d={IMPACT_LOGO_PATH} />
        </svg>
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 124, lineHeight: 0.88, textTransform: "uppercase", maxWidth: 900 }}>
          <span>Git&nbsp;</span>
          <span style={{ color: "#FEFF00" }}>Worktrees&nbsp;</span>
          <span>and Agent Orchestration</span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Barlow", data: await barlow(), weight: 600, style: "normal" }] },
  )
}
