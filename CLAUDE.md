# Worktree presentation

A Next.js site (deployed on Vercel) for a talk about git worktrees, a bare root, and orchestrating
Claude sessions from it. The front page is a dashboard leading to the slides and the setup guide.

## Source of truth

The markdown files are the source of truth for content. The site is written from them by hand, not
parsed from them — keep the pages in line with the markdown, but adapt freely for the web.

- `SLIDES.md` → `/slides`. I decide the structure; don't add slides or content I haven't asked for.
- `GUIDE.md` → `/setup`
- `public/AGENTS.md` → the orchestration template people download. This one is served as-is.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
