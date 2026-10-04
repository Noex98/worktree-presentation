# Worktree presentation

A Next.js site (deployed on Vercel) for a talk about git worktrees, a bare root, and orchestrating
Claude sessions from it. The front page is a dashboard leading to the slides and the setup guide.

## Source of truth

The markdown files are the source of truth for content. The site is written from them by hand, not
parsed from them — keep the pages in line with the markdown, but adapt freely for the web.

- `SLIDES.md` → `/slides`. I decide the structure; don't add slides or content I haven't asked for.
- `GUIDE.md` → `/setup`
- `public/AGENTS.md` → the orchestration template people download. This one is served as-is.
