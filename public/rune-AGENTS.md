# Bare repo root

I always work in linked worktrees. This is currently the bare root — there is no checkout here, so
`git status`, `pnpm` and anything else that reads working-tree files fails or answers about nothing.

I use AI tooling here to orchestrate work. Work is NEVER done from here. You always spawn a new
Warp tab with a Claude session in a worktree and hand the task to that session; you do not implement
it yourself. Even research is done in a worktree. The only work that happens in this session is work
that spans tasks: comparing branches, reading across worktrees, and maintaining this root's own files.

Never run `pnpm i`, `pnpm dev`, a build, a test or a lint from here — a worktree's setup belongs to the
session that lives in it.

## Modus for starting work

I will not say that a task needs a worktree — assume it. So the first decision on every task is which
case you are in:

- new piece of work → new worktree, new session
- something I already have running (`git worktree list`) → spawn into that worktree, never a second one
- genuinely cross-task → handle it here

`git worktree list` is the only source of truth for what exists — there's no separate notes file to
cross-check it against. If it's ambiguous which existing worktree a task belongs to, ask rather than
guess.

The template below stays here, in front of me, because it is the part I tune: without a fixed
template the results vary far more from task to task.

## 1. Create the worktree

This root only tracks `sol-frontend-core` (remote `origin`), so there's no per-project prefixing —
every worktree and branch lives at the top level.

Branch `<type>/SGI-<ticket>-<slug>`, where `<type>` is `feature`, `bug`, `chore`, etc. Use `SGI-000`
when there's no ticket. Confirm the ticket ID with me first if it isn't already clear from context.
The directory is the branch name with `/` replaced by `-`.

Unless told otherwise, branch out from `main` — never from `development` — `main` is the up-to-date
base regardless of what other branches are mid-flight. When I name a different base branch, swap it
in for `origin/main` in the command below.

```
git fetch origin
git worktree add /Users/RSH/Developer/Work/sol-frontend-core-bare/worktrees/<type>-SGI-<ticket>-<slug> -b <type>/SGI-<ticket>-<slug> origin/main
```

Absolute paths, always. Git resolves a relative one against the current directory, which drifts — a
`cd` from an earlier command persists, and that has already nested a worktree inside another one.

`worktrees/main` is the checkout to read for the branch-base state (what a new task starts from);
`worktrees/development` is the checkout to read for what's actually deployed to development.

## 2. Write the brief

Three sections, in this order. The order matters: the session reads top-down and starts acting early,
so the setup warning in CONTEXT has to land before it draws any conclusion about the code.

```
TASK
<my brief, in my own words. Do not summarise it, do not expand on it, do not smooth out the phrasing —
how I said it is part of what I said. Where I was decisive the session should just act; where I was
vague it should stay vague rather than invent a certainty I did not have. If I listed six things, all
six appear, in my order and in my language. The only thing you add is the branch name and the
absolute worktree path, so the session knows where it is.>

CONTEXT
This is a fresh worktree, so the development setup has not been done yet — run `pnpm i`, then
`pnpm --filter @packages/icons build`, then `pnpm env-pull:preview` (writes `.env.local` straight into
each app under `apps/`, no manual copy needed — `.vercel/repo.json` is already committed). Do that
before you conclude anything about the state of the code: a skipped setup step looks exactly like a
mass regression.

`pnpm env-pull:preview` pulls Vercel's Preview environment, which includes `VERCEL_URL=""` — a real
Vercel system var that only gets a value on an actual deployment, so it always comes back empty on a
local pull. `storefront-b2b` and `storefront-content` both crash on startup because of it
(`next-auth/react` throws `TypeError: Invalid URL` / `ERR_INVALID_URL` at module load, from
`src/auth/NextAuthProvider.tsx`). Fix per app, per worktree, right after the env pull: append
`NEXTAUTH_URL=http://localhost:<port>` to that app's `.env.local` (`3000` for `storefront-b2b`, `3001`
for `storefront-content`) — confirmed this clears it and both apps serve `200` locally.

Never add `className` to components to style or override them — it can break in the production build
(CSS order differs between dev and prod, so overrides that look right locally clash once built). Use
the component's own props, or an owned wrapper element, instead.

DONE
<the finish line in one sentence: "both storefronts build and the PLP filter scrolls without a stray
scrollbar".>
```

**Never commit unless I say so.** The finish line is working tree state, not a commit — leave changes
uncommitted and stop there. No PR either way; that only happens on my explicit request, separately.

The brief is the entire handover. The spawned session is detached, so there is no second chance to add
context: whatever gets trimmed is lost, and the only fix is for me to close the session and start the
task over. Favour completeness over brevity — a long prompt is fine when the length is mine rather
than yours: all of my brief, none of your restatement of it. Process requirements are the first thing
a summary drops and the most expensive to lose, which is why CONTEXT and DONE spell them out rather
than leaving them to a closing sentence.

## 3. Spawn the session

Use a Warp Tab Config, not keystroke injection. Tab Configs are `.toml` files that open a tab in a
directory *and* auto-run a command, in a single `open` call — no AppleScript, no Accessibility
permission, no race between an `open` and a keystroke landing in the wrong window. Write the brief to
a scratch file first, same reasoning as before: it keeps the whole TASK/CONTEXT/DONE text out of the
command line, so its quotes, newlines and punctuation never have to survive escaping.

Always launch with `--chrome`, so the spawned session can use the Claude in Chrome extension.

```
BRIEF=/tmp/claude-brief-<slug>.md
# write the brief (see above) to $BRIEF

mkdir -p ~/.warp/tab_configs
cat > ~/.warp/tab_configs/claude_<slug>.toml << EOF
name = "claude_<slug>"
[[panes]]
id = "main"
type = "terminal"
directory = "/Users/RSH/Developer/Work/sol-frontend-core-bare/worktrees/<type>-SGI-<ticket>-<slug>"
commands = ["claude --chrome \"\$(cat $BRIEF)\""]
EOF

open "warp://tab_config/claude_<slug>"
```

The config name is matched case-insensitively against the filename, with or without `.toml`. Repeat
per worktree to start several tasks at once — each is its own file and its own `open` call, so there's
no shared window/focus state to race on. Append `?new_window=true` to the URI to force a new window
instead of a new tab.

(Superseded: Launch Configurations — the predecessor to Tab Configs — silently drop their `commands`
when triggered via `warp://launch/<name>`; only Tab Configs auto-execute on open. Before that, this
step used `warp://action/new_tab` plus `osascript`/System Events keystroke injection, which needed
one-time Accessibility permission and could misfire if more than one Warp window was open, since
`activate` raises Warp's frontmost window, not necessarily the one the new tab opened in.)

## Cross-session communication

Spawned sessions are allowed to talk directly to each other — via `SendMessage`, addressed by session
name — when they're cooperating on the same ticket/feature or one branch's work depends on another's
(e.g. a shared primitive changed on one branch that another branch also owns or builds on). Use
`ListAgents` to find the other session by name. This is between the spawned sessions themselves; it
does not change "## Reporting back" below — this root session still doesn't chase them.

## Reporting back

The spawned session is detached, so nothing comes back here. Report the branch, the worktree path and
what you handed over, then stop. Do not follow up by inspecting the work — reading those files from
here gives me a stale second opinion on what that session is already doing.

## Cleaning up worktrees

When I ask for a cleanup, locate the dead worktrees and remove them — this is cross-task work, so it
happens here. A worktree is dead only when all of these hold, checked read-only first:

- its branch's upstream no longer exists on origin (`git ls-remote --heads origin` — don't fetch
  `--prune`); never-pushed branches are not dead
- nothing on the branch is missing from the remote (`git rev-list --count <branch> --not --remotes` is 0)
- `git status --porcelain --untracked-files=all` is empty
- no process has its cwd inside it (`lsof -a -d cwd -Fn`) — that's a live session or dev server
- it isn't `main` `staging` or `development`

Show me the list, and on my go remove each with `git worktree remove <absolute path>` — never `--force`.
Only the worktree goes: branches, remote refs, stashes, tab configs and briefs are left alone. A worktree
that is dead except for uncommitted files needs my decision; report what the changes are rather than
clearing them so it becomes removable.
