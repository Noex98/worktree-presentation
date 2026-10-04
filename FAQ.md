# FAQ

Problems you might run into after setting up a bare root.

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
