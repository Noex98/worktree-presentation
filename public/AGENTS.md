# Bare repo root

This is a bare root: the repo sits in `.git` with nothing checked out, and every checkout is a worktree
under `worktrees/`. So `git status`, installs, builds, tests and lints don't work here. Don't run them.

**Never do task work here** — not even research. Every task gets a worktree and its own spawned
session. Only cross-task work happens here: comparing branches, reading across worktrees, and
maintaining this root's files.

---
# Configuration

Fill this in for your project. Values in braces, like `{root}`, are set here. Values in angle
brackets, like `<dir>`, are filled in per task.

| Name       | Meaning                              | Value                         |
|------------|--------------------------------------|-------------------------------|
| `{root}`   | Absolute path of this bare root      | `<e.g. C:/code/my-project>`   |
| `{remote}` | The remote to fetch and branch from  | `origin`                      |
| `{base}`   | The branch new worktrees branch from | `<e.g. development>`          |

## `{setup}`: setting up a fresh worktree

Run what the repo's README says.

## `{finish}`: what a session does when it's done

- Code changes → draft PR.
- Research or other questions → commit the findings, no PR.

## `{spawn}`: opening a session

The command that opens a new terminal tab in `<dir>`, running a session with the brief. It reads
the brief from `<brief-file>`, or takes it inline as `<brief>`:

    <e.g. wt -w 0 nt -d <dir> claude '<brief>'>

---
# Dispatching a task

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

If `{spawn}` takes the brief inline, it's passed on a command line, so leave out `'` and `;` —
rephrase instead.

## 3. Spawn the session

Write the brief to `<brief-file>`, a new file in the system's temp folder named after the task. Then
run `{spawn}` once per worktree, with `<dir>` = the absolute worktree path, and `<brief-file>` = the
file's absolute path or `<brief>` = the brief.

## Reporting back

Report the branch, worktree path and what you handed over, then stop. Don't inspect the session's
work from here.

---
# First-time setup

While this section is here, the root hasn't been set up yet. In the first session, do this before
anything else, then delete this section.

When you need to ask me something, use your tool for asking the user questions if you have one, rather
than asking in plain text. Ask everything you can't work out in one go, then don't ask again.

1. **The clone**: check that `.git` is bare (`git config core.bare` is `true`). A bare clone
   doesn't set up fetching, so `git fetch` would update no branches and there'd be no `origin/*`
   branches to branch from. If `remote.origin.fetch` isn't set, set it, then fetch:

       git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
       git fetch origin

2. **Windows long paths**: on Windows only, if `git config --global core.longpaths` isn't `true`,
   explain that worktrees can go over the 260-character path limit, and ask before setting it.
3. **Worktrees**: list the remote's branches and suggest the long-lived ones (the default branch, a
   dev branch, the latest release branch). Ask which to check out, and which one new worktrees branch
   from. Add each one that's missing, with `<dir>` = the branch name with `/` → `-`:

       git worktree add -B <branch> --track worktrees/<dir> origin/<branch>

4. **Configuration**: fill it in.
   - `{root}`: the absolute path of this folder, with forward slashes. `{remote}`: `origin`.
     `{base}`: the branch chosen above.
   - `{setup}`: read `worktrees/{base}` (README, lockfile, scripts, `.env.example`) and write the
     concrete steps a fresh worktree needs. If it's unclear, keep the default.
   - `{finish}`: keep the default unless I say otherwise.
   - `{spawn}`: work out my terminal, or ask, and write the command for it. Reading the brief from
     `<brief-file>` avoids escaping it. Commands by terminal; swap `claude` for my harness:
     - Windows Terminal: `wt -w 0 nt -d <dir> claude '<brief>'`
     - tmux: `tmux new-window -c <dir> 'claude "$(cat <brief-file>)"'`
     - WezTerm: `wezterm cli spawn --cwd <dir> -- sh -c 'claude "$(cat <brief-file>)"'`
     - kitty, with remote control on: `kitty @ launch --type=tab --cwd <dir> sh -c 'claude "$(cat <brief-file>)"'`
     - Warp: write a Tab Config to `~/.warp/tab_configs/claude-<slug>.toml`, without letting your
       shell expand the `$(...)`, then run `open "warp://tab_config/claude-<slug>"`:

           name = "claude-<slug>"
           [[panes]]
           id = "main"
           type = "terminal"
           directory = "<dir>"
           commands = ["claude \"$(cat <brief-file>)\""]

5. **Test `{spawn}`**: it's the step most likely to break, so try it before calling the setup done.
   Write a test brief with the characters that tend to break a command line (leave out `'` and `;`
   if `{spawn}` takes the brief inline):

       Spawn test: it's "quoted"; with $HOME, `ticks` and a
       second line. Reply with this brief exactly as you got it, then stop.

   Spawn it into `worktrees/{base}`, then ask me whether a new tab opened there and the session got
   the brief unchanged. If not, fix `{spawn}` and try again.
6. **Git hooks**: if `worktrees/{base}` has git hooks that run tools calling git from subfolders
   (Turbo, Nx, lint-staged), warn me: in a linked worktree git sets `GIT_DIR` for hooks, which can
   make them pick the wrong repo root or hang. The fix is `unset $(git rev-parse --local-env-vars)`
   at the top of the hook. Only suggest it; it's a change to the repo.
7. **Done**: delete this section, then show me the worktrees and the filled-in Configuration.
