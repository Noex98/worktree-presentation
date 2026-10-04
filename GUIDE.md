# Setup guide

Set up a project as a bare root: one folder that holds the repo and all its worktrees, with Claude
working from the root as a dispatcher.

# With the skill

Install a skill once, and Claude sets up any repo as a bare root for you.

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

# By hand

The same setup, one command at a time.

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

A bare clone doesn't set up fetching of remote branches, so add that and fetch:

```sh
git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
```

```sh
git fetch origin
```

## 3. Add the orchestration file

Download [`AGENTS.md`](/AGENTS.md) into the root. Then point Claude at it by creating a
`CLAUDE.md` next to it containing just this line:

```
@AGENTS.md
```

Fill in the Configuration section at the bottom of `AGENTS.md` so it matches your project:
the root path, remote, base branch, how a fresh worktree is set up, and how to open a new
terminal tab. You can ask Claude in the root to fill it in for you.

## 4. Add the worktrees that always matter

Check out the long-lived branches the project revolves around, like the dev branch, the
production branch, or the latest release branch:

```sh
git worktree add -B development --track worktrees/development origin/development
```

```sh
git worktree add -B main --track worktrees/main origin/main
```

## 5. Start dispatching

```sh
claude
```

Give it a task. It creates a worktree, writes a brief, and opens a new session in that worktree.

On Windows, or seeing git hooks act up in a worktree? See the [FAQ](/faq).
