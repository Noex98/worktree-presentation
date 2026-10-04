# Bare repo root

This is a bare root — no checkout, so `git status`, `{setup}`, builds, tests and lints don't work here.
Don't run them.

**Never do task work here** — not even research. Every task gets a worktree and its own spawned
session. Only cross-task work happens here: comparing branches, reading across worktrees, and
maintaining this root's files.

`{name}` values come from [Configuration](#configuration); `<name>` is filled in per task.

## Which case?

I won't say a task needs a worktree — assume it.

- New work → new worktree, new session
- Already running (`git worktree list`) → spawn into that worktree, never a second one
- Cross-task → handle it here

## 1. Create the worktree

- Path: `worktrees/<dir>`, relative to `{root}` — always via `git -C {root}`, since a lingering
  `cd` has nested worktrees before.
- Branch: `task/<slug>`, or `bugfix/` / `refactor/` when clearly one of those.
- Directory = branch name with `/` → `-`.
- Base = `{base}`, unless I name another.

      git -C {root} fetch {remote}
      git -C {root} worktree add worktrees/task-<slug> -b task/<slug> {remote}/{base}

`worktrees/{base}` is the checkout to read for "what does the code do now".

## 2. Write the brief

The brief is the entire handover — the session is detached, so anything trimmed is lost. Favour
completeness. Three sections, in this order:

    TASK
    <my brief, verbatim — no summarising, expanding or smoothing. Keep my vagueness vague and my lists
    complete, in my order. Add only the branch name and absolute worktree path.>

    CONTEXT
    This is a fresh worktree, so the development setup has not been done yet. Set it up: <{setup}>.
    Do that before you conclude anything about the state of the code: a skipped setup step looks exactly
    like a mass regression.

    DONE
    <the finish line in one sentence, e.g. "both storefronts build and the PLP filter scrolls without a
    stray scrollbar". Then {finish}.>

The brief is passed on a command line, so leave out `'` and `;` — rephrase instead.

## 3. Spawn the session

Run `{spawn}` once per worktree, with `<dir>` = the absolute worktree path and `<brief>` = the brief.

## Reporting back

Report the branch, worktree path and what you handed over, then stop. Don't inspect the session's
work from here.

---
# Configuration
Everything above is shared and works for anyone. Everything below is personal — to reuse this file,
keep the top and fill in these tables with your own values.

## Variables
| Variable   | Meaning                              | Value                         |
|------------|--------------------------------------|-------------------------------|
| `{root}`   | Absolute path of this bare root      | `<e.g. C:/code/my-project>`   |
| `{remote}` | The remote to fetch and branch from  | `origin`                      |
| `{base}`   | The branch new worktrees branch from | `<e.g. development>`          |

## Settings
| Setting    | Meaning                                            | Value                                                                                  |
|------------|----------------------------------------------------|----------------------------------------------------------------------------------------|
| `{setup}`  | How a session sets up its fresh worktree           | Run what the repo's README says                                                        |
| `{finish}` | What a session does with the result when it's done | Code changes → draft PR.<br>Research or other questions → commit the findings, no PR. |
| `{spawn}`  | The command that opens a new tab with a session    | `<e.g. wt -w 0 nt -d <dir> claude '<brief>'>`                                          |

---
# Multi-remote setup
Optional. Only when this root tracks more than one remote — with a single remote, delete this
section. It adjusts the steps above:
- Worktrees go one level deeper, per remote: `worktrees/{remote}/<dir>` for the main remote,
  `worktrees/<p>/<dir>` for each extra one.
- Branches on an extra remote are prefixed `<p>/` (never the remote name). The directory drops that
  prefix.
- Fetch and branch from that row's remote and base branch.
- PRs name the repo: `gh pr create -R <repo>` — `gh` otherwise defaults to `{remote}`.

| Prefix `<p>` | Remote | GitHub repo (`gh -R`) | Base branch |
|--------------|--------|-----------------------|-------------|
|              |        |                       |             |
