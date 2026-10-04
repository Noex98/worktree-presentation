# Worktree presentation

A Next.js site (deployed on Vercel) for a talk about git worktrees, a bare root, and orchestrating
Claude sessions from it. The front page is a dashboard leading to the slides and the setup guide.

## Source of truth

The markdown files are the source of truth for content. The site is written from them by hand, not
parsed from them — keep the pages in line with the markdown, but adapt freely for the web.

- `SLIDES.md` → `/slides`. I decide the structure; don't add slides or content I haven't asked for.
- `GUIDE.md` → `/setup`, including its FAQ
- `public/AGENTS.md` → the orchestration template people download. This one is served as-is.
- `public/skills/bare-root/SKILL.md` → the setup skill people download. Served as-is; it uses
  `AGENTS.md` as its reference file, so keep its steps in line with `GUIDE.md`.

## Design

The look follows IMPACT's PowerPoint master template (`IMPACT_Master_Template.potx` in the IMPACT
Asset Library on SharePoint), not impactcommerce.com, which is older.

- Colours: black, white and yellow `#FEFF00`, plus the greys `#F2F2F2`, `#BFBFBF` and `#A5A5A5`.
  Yellow only highlights words and icons on black; on white, words are highlighted in grey.
  `<Highlight>` picks the right one.
- Type: Flama Condensed Medium for uppercase headlines, with no extra letter spacing, and Plantin
  for text and italic intros. Both are licensed, so the site uses them only where they're installed
  and otherwise falls back to Barlow Condensed and Source Serif.
- Icons are Phosphor, regular weight. Corners are square, and slides carry the IMPACT logo in the
  bottom-left corner.
- Pages stay white for screen sharing; black is for panels, like the template's title and agenda
  slides.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
