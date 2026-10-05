# Slides

<!-- One slide per `---`. Anything after a `Notes:` line is speaker notes. -->
<!-- For now this is a high-level outline of the sections, not slides yet. -->

# Git Worktrees and Agent Orchestration

## Intro

- **About me**: Johannes Knickering, frontend engineer, 3+ years at IMPACT, on the accelerator team
- **Why now**: agentic work has made worktrees more relevant than ever. We need a way for agents to
  work on multiple tasks in parallel, to eliminate the waiting time we have as developers
- **The angle**: most of us know about worktrees and have for a while, but there are many ways of
  working with them

## Agenda

1. **The foundation**: understanding the technology
2. **Next to your main worktree**: adding worktrees alongside the checkout you already have
3. **Claude's worktree feature**: how it works when Claude makes the worktrees
4. **The bare root**: a space above the worktrees where we start Claude and let it orchestrate

## The foundation

- **What a worktree is**: to understand it, look at the git dir. Cloning a repo gives you a dir with
  a `.git` dir inside it, which holds the data for the repo's files at any given commit. In it, the
  `HEAD` file holds a ref to a branch, and the branch holds a ref to a commit. The main worktree is
  the file representation of that commit, and the `.git` dir sits inside it, which matters later for
  bare repos. Any worktree is a file representation of a commit; the main one is just the one you
  get from cloning
- **The moral**: we all use worktrees all the time
- **What a linked worktree is**: the same files, one dir out, so it's just the main worktree like
  before. Then we run `git worktree add` and see what changes

## Next to your main worktree

- **Why people stop**: it's really the placement
  - **Linked worktrees live next to the main one**: side by side with your other projects, or in a
    project folder you still cd into the main worktree from
  - **It's not clear when to use linked or main**: so linked worktrees become a side thing, and over
    time people stop using them
- Quotes from Reddit, if anyone asks:
  - "Those I assume live directly in your `~/code` or `~/dev` directory next to other projects,
    right? If yes, that's something I find confusing myself"
    ([u/ahmedelgabri](https://www.reddit.com/r/git/comments/1qxfqia/introducing_gitwt_worktrees_simplified/o3wv6eh/))
  - "…so there is no confusion as to the repo name or which folders are linked worktrees and which
    is the main repo." ([u/xfinitystones](https://www.reddit.com/r/git/comments/1lls1ot/vscode_and_git_worktrees/p4i0oad/),
    on why they put everything under one folder)
  - "…there is no reason to have one worktree have primacy over the rest"
    ([u/masklinn](https://www.reddit.com/r/programming/comments/1wi0xi2/git_worktree_gotchas/pa7xw3v/),
    who uses a bare repo with worktrees forked off it)
  - "Did I open the editor from the right folder? […] So in the end… I've mostly stopped using
    worktrees more or less…" ([u/format71](https://www.reddit.com/r/git/comments/1ohcv3c/discovered_and_wrote_about_git_worktrees/nlo7hyc/))
- Earlier quotes, from Hacker News and blogs:
  - "After a few months, you can't tell worktrees from clones at a glance. You forget what's linked
    to what." ([gabri.me](https://gabri.me/blog/git-worktrees-done-right))
  - "Lack of conventions (or rather the braindead defaults) and having to explicitly type out
    everything is what hinders adoption the most." ([anilakar](https://news.ycombinator.com/item?id=49654726),
    who now uses a root folder with per-branch folders and a hidden bare repo)
  - "…even with one directory per branch I seem to switch branches within each checkout without
    thinking" ([yjftsjthsd-h](https://news.ycombinator.com/item?id=39598714))
  - "This is also how I originally had used worktrees, but that didn't stick, and I abandoned them."
    ([matklad](https://matklad.github.io/2024/07/25/git-worktrees.html), who later came back to them
    for a different use)
- What I'll say: everything gets placed oddly. The worktrees sit side by side with your other
  projects, or you make a project folder with the main worktree in it, but then you still cd into
  the main worktree to make new worktrees. It's not clear when to use linked worktrees and when the
  main worktree, so linked worktrees become a side thing, and over time people stop using them
  because the DX is annoying

Notes: backed up by the git docs and others
  - **One worktree is special**: "The main worktree cannot be removed", and every linked worktree
    points back into its `.git` ([git-worktree](https://git-scm.com/docs/git-worktree))
  - **It holds on to its branch**: git "refuses to create a new worktree when <commit-ish> is a
    branch name and is already checked out by another worktree", and the main worktree usually
    sits on `main` ([git-worktree](https://git-scm.com/docs/git-worktree))
  - **Moving it breaks the others**: "the main worktree … cannot be moved with this command", and
    moving it by hand needs `git worktree repair` ([git-worktree](https://git-scm.com/docs/git-worktree))
  - **Deleted folders linger**: a sibling deleted by hand leaves its admin files behind until
    `git worktree prune`, and git refuses that path until then
    ([git-worktree](https://git-scm.com/docs/git-worktree))
  - **The quote**: "One thing I don't like about this setup is the "scatteredness" of my repo with
    one seemingly blessed worktree and then a bunch of siblings that are outside of that worktree."
    ([Nick Nisi](https://nicknisi.com/posts/git-worktrees/))
  - Not worth raising, since a bare root has them too: gitignored files like `.env` and
  `node_modules` missing from every new worktree, editors struggling with many worktrees, dev
  servers clashing on the same port, and incomplete submodule support

## Claude's worktree feature

- **What `claude -w` does**: the same view, but we run `claude -w feature 'Make a new feature'`.
  Claude makes the worktree inside the main worktree, in `.claude/worktrees/feature`, on a branch
  named `worktree-feature`

## The bare root

- **My setup**: the bare root from the setup guide. The repo is cloned bare into `.git`, the
  long-lived branches are checked out under `worktrees/`, and `AGENTS.md` and `CLAUDE.md` sit in the
  root
