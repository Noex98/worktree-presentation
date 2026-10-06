# Bare repo setup

Set up a project as a bare root: one folder that holds the repo and all its worktrees, with an agent
working from the root as a dispatcher.

## Any harness

This guide sets it up with Claude Code, but any agent harness works. `AGENTS.md` is plain markdown
that Claude, Codex, Copilot, OpenCode and others read on their own. With another harness, use the manual path, start it where the guide starts `claude`, and
have the `{spawn}` command open it.

Pick one of two paths. The FAQ at the bottom applies to both.

# With a skill

Install a user-scoped skill once, and Claude sets up any repo for you.

## 1. Install the skill

Download both files into `~/.claude/skills/bare-root/`. That installs the skill for your user, so it
works in every folder.

- [`SKILL.md`](/skills/bare-root/SKILL.md): the setup steps Claude follows
- [`AGENTS.md`](/AGENTS.md): the orchestration file it copies into the root

## 2. Run it

Start Claude in the folder where you keep your code, and run the skill with the repo:

```sh
claude
```

```
/bare-root <repo-url>
```

It asks which branches to check out, then clones the repo, adds the worktrees, and fills in
`AGENTS.md` for you.

## 3. Start dispatching

Start Claude in the new root and give it a task:

```sh
cd <folder>
```

```sh
claude
```

# Manual

Run the git commands yourself, one at a time, then let Claude finish the setup.

## 1. Make the project folder

```sh
mkdir my-project
```

```sh
cd my-project
```

## 2. Clone the repo bare into `.git`

Cloning into `.git` keeps the repo's internals in one hidden folder, instead of spreading them
across the project folder the way a plain `git clone --bare` does.

```sh
git clone --bare <repo-url> .git
```

## 3. Add the orchestration file

Download [`AGENTS.md`](/AGENTS.md) into the root.

On an older Claude Code version that doesn't read `AGENTS.md`, also create a `CLAUDE.md` next to it
containing just `@AGENTS.md`.

## 4. Let Claude finish the setup

Start Claude in the root:

```sh
claude
```

And tell it to get going:

```
Set up this root.
```

Its first session follows the First-time setup section at the bottom of `AGENTS.md`. It sets up
fetching, which a bare clone leaves out, asks which long-lived branches to check out, like the dev branch, the production branch, or
the latest release branch, and adds them under `worktrees/`. Then it fills in the Configuration
section, opens a test session to check that spawning works in your terminal, and deletes the
First-time setup section.

## 5. Start dispatching

Give it a task. It creates a worktree, writes a brief, and opens a new session in that worktree. For
a first try, pick something small, and tell it not to commit, so you can look at the changes first:

```
Make the setup steps in the README clearer. Do not commit the changes.
```

# FAQ

## Git fails with "Filename too long" on Windows

Windows limits paths to 260 characters by default. Worktrees sit a few folders deeper than a normal
checkout (`my-project/worktrees/<name>/…`), so long paths, often in `node_modules`, go over the
limit. Tell git to allow long paths:

```sh
git config --global core.longpaths true
```

## A git hook behaves differently in a worktree

When git runs a hook, it sets environment variables like `GIT_DIR` for it. In a linked worktree,
`GIT_DIR` points to the worktree's own git folder (`.git/worktrees/<name>`), and with `GIT_DIR` set
but no `GIT_WORK_TREE`, git treats the current directory as the root of the work tree. Tools that run
git from a subfolder then get the wrong root. Turbo, for example, runs git from each package folder
to hash its inputs, mistakes every package for the repo root, and hangs.

Clear git's variables at the top of the hook, so tools find the work tree the normal way:

```sh
unset $(git rev-parse --local-env-vars)
```

`git rev-parse --local-env-vars` prints git's own list of these variables. The
[githooks docs](https://git-scm.com/docs/githooks) mention the same: hooks that run git in another
repository should clear them.
