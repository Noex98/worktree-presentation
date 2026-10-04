---
name: bare-root
description: Set up a git repo as a bare root — one folder holding the bare repo in .git, its worktrees in worktrees/, and an AGENTS.md that makes Claude in the root a dispatcher. Use when the user types /bare-root, or asks to set up a bare root, a worktree root, or the worktree setup for a repo.
argument-hint: <repo-url> [folder]
---

# Set up a bare root

Set up a repo as a bare root in a new folder: the bare repo in `.git`, the long-lived branches
checked out under `worktrees/`, and `AGENTS.md` from this skill's folder as the root's instructions.

Run every command on its own, not chained. Don't touch anything outside the new folder, except the
global git setting in step 2, and only with the user's go-ahead.

## 0. Gather

Ask everything you can't work out in one go, then don't ask again.

- **Repo URL**: from the arguments. Otherwise, if the current directory is a clone, offer its
  `origin` URL. Otherwise ask.
- **Folder**: from the arguments, else the repo name in the current directory. It must not exist
  yet, or be empty.
- **Branches**: list them with `git ls-remote --heads <url>` and find the default branch with
  `git ls-remote --symref <url> HEAD`. Suggest the long-lived ones (the default branch, a dev branch,
  the latest release branch) and ask which to check out, and which one new worktrees branch from
  (`{base}`). Suggest the dev branch if there is one, else the default branch.

## 1. Clone

    mkdir <folder>
    git clone --bare <url> <folder>/.git
    git -C <folder> config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
    git -C <folder> fetch origin

A bare clone only sets the remote's URL, not where fetched branches go. Without the `config` line,
`git fetch` updates nothing and there are no `origin/*` branches to branch from.

## 2. Windows long paths

On Windows only: if `git config --global core.longpaths` isn't `true`, explain that worktrees sit
deeper than a normal checkout and can go over Windows' 260-character path limit, and ask before
running:

    git config --global core.longpaths true

## 3. Worktrees

Once per chosen branch, with `<dir>` = the branch name with `/` → `-`:

    git -C <folder> worktree add -B <branch> --track worktrees/<dir> origin/<branch>

## 4. Orchestration file

Copy `AGENTS.md` from this skill's folder into the root unchanged, and create `CLAUDE.md` next to it
containing only:

    @AGENTS.md

Then fill in the Configuration section of the root's `AGENTS.md`:

- `{root}`: the absolute path of the folder, with forward slashes.
- `{remote}`: `origin`.
- `{base}`: the branch chosen in step 0.
- `{setup}`: read `worktrees/<base>` (README, lockfile, `package.json` scripts, `.env.example`) and
  write the concrete steps a fresh worktree needs, e.g. "copy .env from worktrees/development, then
  pnpm install". If it's unclear, keep "Run what the repo's README says".
- `{finish}`: keep the default unless the user says otherwise.
- `{spawn}`: on Windows with Windows Terminal, `wt -w 0 nt -d <dir> claude '<brief>'`. Otherwise
  ask which terminal they use and write the command that opens a new tab in `<dir>` running
  `claude '<brief>'`.
- Delete the Multi-remote setup section; this root has one remote.

## 5. Git hooks

Look in `worktrees/<base>` for git hooks (`.husky/`, `lefthook.yml`, `.pre-commit-config.yaml`,
`core.hooksPath`). If there are any and they run tools that call git from subfolders (Turbo, Nx,
lint-staged), warn the user: in a linked worktree git sets `GIT_DIR` for hooks, which can make those
tools pick the wrong repo root or hang. The fix is this line at the top of the hook:

    unset $(git rev-parse --local-env-vars)

That's a change to the repo, so only suggest it; don't make it.

## 6. Report

Show the folder layout, the worktrees, and the filled-in Configuration. Then tell the user to start
`claude` in the root and give it a task.
