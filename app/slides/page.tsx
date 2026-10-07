import { readFileSync } from "node:fs"
import { join } from "node:path"
import { Fragment } from "react"
import { Highlight } from "@/components/highlight"
import { Deck } from "@/components/slides/deck"
import { type Command, type Entry, FileExplorer } from "@/components/slides/file-explorer"
import { Guest, ZoomImage } from "@/components/slides/guest"
import { Markdown } from "@/components/slides/markdown"
import { Slide, TitleSlide } from "@/components/slides/slide"
import { cn } from "@/lib/utils"

// Written from SLIDES.md — keep the two in line.

const about = [
  { label: "Role", value: "Frontend engineer" },
  { label: "At IMPACT", value: "3+ years" },
  { label: "Team", value: "Accelerator" },
]

// An hour of work, in minutes. Your time is one thread either way: you start every task and follow up
// when it's done, and in between you monitor. With one worktree that's one agent. With many, the agents
// work side by side, and each gets a bigger task, so following up on them doesn't take all your time.
type Span = [from: number, to: number, note?: string]

const HOUR = 60

const timeline: { title: string; lanes: { label: string; you?: Span[]; agent?: Span[]; monitoring?: Span[] }[] }[] = [
  {
    title: "One worktree",
    lanes: [
      {
        label: "You",
        you: [[0, 3], [15, 18], [30, 33], [45, 48]],
        monitoring: [[3, 15], [18, 30], [33, 45], [48, 60]],
      },
      {
        label: "Agent",
        agent: [[3, 15, "smaller task"], [18, 30, "smaller task"], [33, 45, "smaller task"], [48, 60, "smaller task"]],
      },
    ],
  },
  {
    title: "Many worktrees",
    lanes: [
      {
        label: "You",
        you: [[0, 3], [3, 6], [6, 9], [32, 35], [40, 43], [50, 53]],
        monitoring: [[9, 32], [35, 40], [43, 50], [53, 60]],
      },
      { label: "Agent 1", agent: [[3, 32, "bigger task"], [35, 60]] },
      { label: "Agent 2", agent: [[6, 50, "bigger task"], [53, 60]] },
      { label: "Agent 3", agent: [[9, 40, "bigger task"], [43, 60]] },
    ],
  },
]

const agenda = [
  { title: "The foundation", description: "Understanding the technology" },
  { title: "Next to your main worktree", description: "Adding worktrees alongside the checkout you already have" },
  { title: "Claude's worktree feature", description: "How it works when Claude makes the worktrees" },
  { title: "The bare root", description: "A space above the worktrees where we start Claude and let it orchestrate" },
]

// What a clone gives you: a folder that is the main worktree, holding the files of one commit, with the
// .git dir inside it. In .git, the HEAD file refers to a branch, and the branch to a commit.
const LATEST = "4d81e3c09b7f2a6d5e1c8b3a7f0d9e2c4b6a8f10"
const FIRST = "e9b05a7c3d1f8e2b6a4c9d0f7e3b5a1c8d2f6e94"
const COMPRESSED = "Stored compressed; shown here as git cat-file -p prints it."

// A linked worktree: its name in .git/worktrees, its branch, and where it is on disk.
type Worktree = { name: string; branch: string; path: string }

// The files git tracks, which every worktree gets, and the gitignored ones, which only the main worktree
// has: a new worktree is checked out from a commit, and these were never committed.
const tracked = {
  folders: [{ name: "src", children: [{ name: "index.ts", content: 'export const greeting = "Hello"' }] }],
  files: [
    { name: ".gitignore", content: "node_modules/\n.env" },
    {
      name: "package.json",
      content: [
        "{",
        '  "name": "accelerator",',
        '  "version": "1.0.0",',
        '  "scripts": {',
        '    "env-pull": "vercel env pull .env",',
        '    "build:design-system": "pnpm --filter design-system build"',
        "  }",
        "}",
      ].join("\n"),
    },
    // What AGENTS.md's default setup points a new session at: "Run what the repo's README says".
    {
      name: "README.md",
      content: [
        "# Accelerator",
        "",
        "Welcome to the Accelerator.",
        "",
        "## Setup",
        "",
        "To set up the dev environment, run:",
        "",
        "```sh",
        "pnpm i",
        "pnpm env-pull",
        "pnpm build:design-system",
        "```",
      ].join("\n"),
    },
  ],
} satisfies Record<string, Entry[]>

const ignored = {
  folders: [
    {
      name: "node_modules",
      ignored: true,
      children: [
        { name: "next", children: [{ name: "package.json", content: '{\n  "name": "next",\n  "version": "16.3.8"\n}' }] },
        { name: "react", children: [{ name: "package.json", content: '{\n  "name": "react",\n  "version": "19.2.0"\n}' }] },
      ],
    },
  ],
  files: [{ name: ".env", ignored: true, content: "DATABASE_URL=postgres://localhost:5432/accelerator\nAPI_KEY=secret" }],
} satisfies Record<string, Entry[]>

const objects: Entry = {
  name: "objects",
  children: [
    {
      name: LATEST.slice(0, 2),
      children: [
        {
          name: LATEST.slice(2),
          note: COMPRESSED,
          content: [
            "tree 9a3f1c7e5b2d8a4f6c0e9b3d7a1f5c2e8b4d6a03",
            `parent ${FIRST}`,
            "author Johannes <johannes@example.com> 1759670400 +0200",
            "committer Johannes <johannes@example.com> 1759670400 +0200",
            "",
            "Add a greeting",
          ].join("\n"),
        },
      ],
    },
    {
      name: FIRST.slice(0, 2),
      children: [
        {
          name: FIRST.slice(2),
          note: COMPRESSED,
          content: [
            "tree 2c7e4a9f1b3d5c8e0a6f2d4b7c9e1a3f5d8b0c62",
            "author Johannes <johannes@example.com> 1759584000 +0200",
            "committer Johannes <johannes@example.com> 1759584000 +0200",
            "",
            "Initial commit",
          ].join("\n"),
        },
      ],
    },
  ],
}

// A linked worktree's folder in .git/worktrees, with its own HEAD.
function worktreeDir({ name, branch, path }: Worktree): Entry {
  return {
    name,
    children: [
      { name: "HEAD", content: `ref: refs/heads/${branch}` },
      { name: "commondir", content: "../.." },
      { name: "gitdir", content: `${path}/.git` },
    ],
  }
}

// With a `linked` worktree, the main worktree as adding it leaves it: a new branch, and a folder in
// .git/worktrees with the linked worktree's own HEAD. `extra` goes before .git, like a .claude folder.
function clone(linked?: Worktree, extra: Entry[] = []): Entry {
  return {
    name: "accelerator",
    tag: "Main worktree",
    open: true,
    children: [
      ...extra,
      {
        name: ".git",
        children: [
          objects,
          {
            name: "refs",
            children: [
              {
                name: "heads",
                children: [
                  ...(linked ? [{ name: linked.branch, content: LATEST, added: true }] : []),
                  { name: "main", content: LATEST },
                ].sort((a, b) => a.name.localeCompare(b.name)),
              },
              // The remote's branches as of the last fetch, and its default branch.
              {
                name: "remotes",
                children: [
                  {
                    name: "origin",
                    children: [
                      { name: "HEAD", content: "ref: refs/remotes/origin/main" },
                      { name: "main", content: LATEST },
                    ],
                  },
                ],
              },
            ],
          },
          ...(linked ? [{ name: "worktrees", added: true, children: [worktreeDir(linked)] }] : []),
          { name: "HEAD", content: "ref: refs/heads/main" },
          {
            name: "config",
            content: [
              "[core]",
              "\tbare = false",
              '[remote "origin"]',
              "\turl = git@github.com:example/accelerator.git",
              "\tfetch = +refs/heads/*:refs/remotes/origin/*",
              '[branch "main"]',
              "\tremote = origin",
              "\tmerge = refs/heads/main",
            ].join("\n"),
          },
        ],
      },
      ...ignored.folders,
      ...tracked.folders,
      ...ignored.files,
      ...tracked.files,
    ],
  }
}

// A linked worktree's folder: the tracked files of a commit, with no gitignored ones, and a .git that is
// a file pointing back into the main worktree's .git. Made by a command unless `added` says otherwise.
// `setUp` adds the gitignored files a worktree gets once it's set up, like node_modules and .env.
function linkedWorktree({ name, path }: Worktree, { added = true, setUp = false } = {}): Entry {
  return {
    name: path.split("/").at(-1)!,
    tag: "Linked worktree",
    added,
    open: added,
    children: [
      ...(setUp ? ignored.folders : []),
      ...tracked.folders,
      ...(setUp ? ignored.files : []),
      { name: ".git", content: `gitdir: /code/accelerator/.git/worktrees/${name}` },
      ...tracked.files,
    ],
  }
}

// Next to the main worktree, by hand.
const feature: Worktree = { name: "accelerator-feature", branch: "feature", path: "/code/accelerator-feature" }

const addWorktree: Command = {
  cwd: "code/accelerator",
  run: "git worktree add -b feature ../accelerator-feature",
  result: { name: "code", open: true, children: [clone(feature), linkedWorktree(feature)] },
  // From git's docs: https://git-scm.com/docs/git-worktree
  help: {
    summary: "Checks out a branch in a new folder: here a new branch, feature, in ../accelerator-feature.",
    items: [
      {
        label: "Branches from",
        text: "Your current HEAD. Name a starting point at the end to branch from something else.",
        code: "git worktree add -b feature ../accelerator-feature origin/main",
      },
      {
        label: "An existing branch",
        text: "Leave out -b and name the branch. Git refuses if another worktree has it checked out.",
        code: "git worktree add ../accelerator-hotfix hotfix",
      },
      {
        label: "No branch name",
        text: "Without -b or a branch, git makes a new branch named after the folder.",
        code: "git worktree add ../feature",
      },
      {
        label: "Follow a remote branch",
        text: "-B creates the branch, or resets it if it exists; --track sets it to pull from the remote.",
        code: "git worktree add -B development --track ../accelerator-dev origin/development",
      },
      {
        label: "No branch at all",
        text: "--detach points the worktree straight at a commit, so many worktrees can share one.",
        code: "git worktree add --detach ../accelerator-review main",
      },
      {
        label: "Tidy up",
        text: "List, remove, and clear out worktrees whose folders were deleted by hand.",
        code: "git worktree list\ngit worktree remove ../accelerator-feature\ngit worktree prune",
      },
    ],
  },
}

// Inside the main worktree, in .claude/worktrees, on a branch Claude names worktree-<name>.
const claudeFeature: Worktree = {
  name: "feature",
  branch: "worktree-feature",
  path: "/code/accelerator/.claude/worktrees/feature",
}

const claudeWorktree: Command = {
  cwd: "code/accelerator",
  run: "claude -w feature 'Make a new feature'",
  // From Claude Code's docs: https://code.claude.com/docs/en/worktrees
  help: {
    summary: "Makes a worktree in .claude/worktrees/feature, on a new branch named worktree-feature, and starts Claude in it.",
    items: [
      {
        label: "Branches from",
        text: "The remote’s default branch, origin/HEAD, fetched first if it’s older than 24 hours. Not the branch you’re on.",
      },
      {
        label: "Branch from your work",
        text: "Set worktree.baseRef to head to branch from your current HEAD. It can’t be a branch name.",
        code: '{ "worktree": { "baseRef": "head" } }',
      },
      {
        label: "From a pull request",
        text: "Pass a PR number or URL, and Claude fetches its head commit into .claude/worktrees/pr-<number>.",
        code: "claude -w \"#1234\"",
      },
      {
        label: ".env and other ignored files",
        text: "Not copied, unless they’re listed in .worktreeinclude, written like .gitignore.",
        code: ".env\n.env.local",
      },
      {
        label: "Dependencies",
        text: "Not installed. Ask Claude to install them, or run the project’s setup in the worktree yourself.",
      },
      {
        label: "When you exit",
        text: "A clean worktree is removed with its branch. One with changes asks whether to keep it.",
      },
    ],
  },
  result: {
    name: "code",
    open: true,
    children: [
      clone(claudeFeature, [
        {
          name: ".claude",
          added: true,
          open: true,
          children: [{ name: "worktrees", open: true, children: [linkedWorktree(claudeFeature)] }],
        },
      ]),
    ],
  },
}

// Why people stop using worktrees next to a normal clone: it comes down to placement.
const reasons = [
  {
    title: "Linked worktrees live next to the main one",
    text: "Side by side with your other projects, or in a project folder you still cd into the main worktree from.",
  },
  {
    title: "It’s not clear when to use linked or main",
    text: "So linked worktrees become a side thing, and over time people stop using them.",
  },
]

// A bare clone into an empty folder: what .git would hold lands straight in the folder, ungrouped, with no
// files checked out. It's what git servers keep (https://git-scm.com/docs/gitglossary#def_bare_repository). The remote's branches become local branches, and there's no fetch line in the config,
// which GUIDE.md adds.
const emptyRoot: Entry = { name: "accelerator", open: true, children: [] }

const bareClone: Command = {
  cwd: "code/accelerator",
  run: "git clone --bare git@github.com:example/accelerator.git .",
  result: {
    ...emptyRoot,
    children: [
      { ...objects, added: true },
      {
        name: "refs",
        added: true,
        children: [
          { name: "heads", children: ["development", "main"].map((branch) => ({ name: branch, content: LATEST })) },
        ],
      },
      { name: "HEAD", added: true, content: "ref: refs/heads/main" },
      {
        name: "config",
        added: true,
        content: ["[core]", "\tbare = true", '[remote "origin"]', "\turl = git@github.com:example/accelerator.git"].join("\n"),
      },
    ],
  },
}

// My setup, the bare root from GUIDE.md: the repo cloned bare into .git, so the root itself checks
// nothing out, every worktree is a linked one under worktrees/, and AGENTS.md makes Claude in the root a
// dispatcher.
const agentsTemplate = readFileSync(join(process.cwd(), "public", "AGENTS.md"), "utf8")

const longLived: Worktree[] = ["development", "main"].map((branch) => ({
  name: branch,
  branch,
  path: `/code/accelerator/worktrees/${branch}`,
}))

// The worktree AGENTS.md has Claude make for a task: worktrees/task-<slug> on task/<slug>, from the base.
const task: Worktree = { name: "task-new-feature", branch: "task/new-feature", path: "/code/accelerator/worktrees/task-new-feature" }

// With a `dispatched` task, the root as Claude leaves it after dispatching it.
function bareRoot(dispatched?: Worktree): Entry {
  const [prefix, slug] = dispatched?.branch.split("/") ?? []
  return {
    name: "accelerator",
    open: true,
    children: [
      {
        name: ".git",
        children: [
          objects,
          {
            name: "refs",
            children: [
              {
                name: "heads",
                children: [
                  ...longLived.map(({ branch }) => ({ name: branch, content: LATEST })),
                  ...(dispatched ? [{ name: prefix, added: true, children: [{ name: slug, content: LATEST }] }] : []),
                ],
              },
              {
                name: "remotes",
                children: [{ name: "origin", children: longLived.map(({ branch }) => ({ name: branch, content: LATEST })) }],
              },
            ],
          },
          {
            name: "worktrees",
            children: [
              ...longLived.map(worktreeDir),
              ...(dispatched ? [{ ...worktreeDir(dispatched), added: true }] : []),
            ],
          },
          { name: "HEAD", content: "ref: refs/heads/main" },
          {
            name: "config",
            content: [
              "[core]",
              "\tbare = true",
              '[remote "origin"]',
              "\turl = git@github.com:example/accelerator.git",
              "\tfetch = +refs/heads/*:refs/remotes/origin/*",
              ...longLived.flatMap(({ branch }) => [`[branch "${branch}"]`, "\tremote = origin", `\tmerge = refs/heads/${branch}`]),
            ].join("\n"),
          },
        ],
      },
      {
        name: "worktrees",
        open: true,
        children: [
          // Set up, so they have their gitignored files: the new session sets its worktree up first.
          ...longLived.map((worktree) => linkedWorktree(worktree, { added: false, setUp: true })),
          ...(dispatched ? [linkedWorktree(dispatched, { setUp: true })] : []),
        ],
      },
      { name: "AGENTS.md", content: agentsTemplate },
      { name: "CLAUDE.md", content: "@AGENTS.md" },
    ],
  }
}

// Any agent that reads AGENTS.md dispatches the same way, so the command cycles through them, each started
// with the prompt the way its CLI takes one.
const dispatch: Command = {
  cwd: "code/accelerator",
  run: "claude 'Make a new feature'",
  cycle: ["codex 'Make a new feature'", "copilot -i 'Make a new feature'", "opencode --prompt 'Make a new feature'"],
  result: bareRoot(task),
  help: {
    summary:
      "It doesn’t matter which agent you start the work with. You tell it to do something, and it does it in a worktree.",
    items: [],
  },
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-heading text-[1.25cqw] tracking-wide text-muted-foreground uppercase", className)}>{children}</p>
  )
}

// Swimlanes on a shared time axis: black is you starting or following up on a task, grey is an agent
// working, and light grey is you monitoring.
function Timeline() {
  const at = ([from, to]: Span) => ({ left: `${(from / HOUR) * 100}%`, width: `${((to - from) / HOUR) * 100}%` })
  const block = "absolute inset-y-0 flex items-center justify-center border-x-[0.1cqw] border-background"

  return (
    <div className="grid grid-cols-[7cqw_1fr] items-center gap-x-[1.5cqw] gap-y-[0.5cqw]">
      {timeline.map(({ title, lanes }, i) => (
        <Fragment key={title}>
          <p className={cn("col-span-2 font-heading text-[1.6cqw] leading-none uppercase", i > 0 && "mt-[1.8cqw]")}>
            {title}
          </p>
          {lanes.map(({ label, you = [], agent = [], monitoring = [] }) => (
            <Fragment key={label}>
              <Label className={you.length > 0 ? "text-foreground" : undefined}>{label}</Label>
              <div className="relative h-[2cqw]">
                {agent.map((span) => (
                  <div key={span[0]} className={cn(block, "bg-(--impact-grey-mid) text-[1.15cqw] italic")} style={at(span)}>
                    {span[2]}
                  </div>
                ))}
                {you.map((span) => (
                  <div
                    key={span[0]}
                    className={cn(block, "bg-foreground font-heading text-[1.15cqw] text-background")}
                    style={at(span)}
                  >
                    {span[2]}
                  </div>
                ))}
                {monitoring.map((span) => (
                  <div key={span[0]} className={cn(block, "bg-muted text-[1.15cqw] italic")} style={at(span)}>
                    monitoring
                  </div>
                ))}
              </div>
            </Fragment>
          ))}
        </Fragment>
      ))}
      <div className="col-start-2 mt-[0.8cqw] flex items-center gap-[0.8cqw]">
        <div className="flex flex-1 items-center">
          <div className="h-px flex-1 bg-foreground" />
          <svg viewBox="0 0 6 10" fill="none" stroke="currentColor" className="-ml-px h-[0.8cqw] w-[0.48cqw]">
            <path d="M0 0l6 5-6 5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <Label>Time</Label>
      </div>
    </div>
  )
}

const slides = [
  <TitleSlide
    key="title"
    title={
      <>
        Git <Highlight>Worktrees</Highlight> and Agent Orchestration
      </>
    }
    subtitle="One repo, many worktrees, and Claude dispatching work from the root."
  />,

  <Slide key="about" panel="Johannes Knickering" eyebrow="About me">
    <dl>
      {about.map(({ label, value }) => (
        <div key={label} className="space-y-[1cqw] border-t border-foreground py-[2cqw] last:border-b">
          <dt>
            <Label>{label}</Label>
          </dt>
          <dd className="font-heading text-[4.2cqw] leading-none uppercase">{value}</dd>
        </div>
      ))}
    </dl>
  </Slide>,

  <Slide key="why" eyebrow="Why now" title="Agentic work has made worktrees more relevant than ever">
    <Timeline />
    <p className="max-w-[62cqw] text-[2.4cqw] leading-tight italic">
      We need a way for agents to work on multiple tasks in parallel, to eliminate the waiting time we have as
      developers.
    </p>
  </Slide>,

  <Slide
    key="agenda"
    panel="Agenda"
    title={
      <>
        <Highlight>Most of us know worktrees.</Highlight> But there are many ways of working with them.
      </>
    }
  >
    <ol>
      {agenda.map(({ title, description }, i) => (
        <li key={title} className="grid grid-cols-[4cqw_1fr] border-t border-foreground py-[1.3cqw] last:border-b">
          <span className="font-heading text-[1.7cqw] leading-none text-muted-foreground tabular-nums">0{i + 1}</span>
          <div className="space-y-[0.5cqw]">
            <p className="font-heading text-[1.7cqw] leading-none uppercase">{title}</p>
            <p className="text-[1.45cqw] leading-snug">{description}</p>
          </div>
        </li>
      ))}
    </ol>
  </Slide>,

  <Slide key="worktree" eyebrow="The foundation" title="What is a worktree?">
    <FileExplorer root={clone()} />
    <p className="max-w-[62cqw] text-[2.4cqw] leading-tight italic">
      Any worktree is a file representation of a commit, and cloning gives you the main one.{" "}
      <Highlight>We all use worktrees all the time.</Highlight>
    </p>
  </Slide>,

  <Slide key="linked" eyebrow="The foundation" title="What is a linked worktree?">
    <FileExplorer
      root={{ name: "code", open: true, children: [clone()] }}
      command={addWorktree}
    />
  </Slide>,

  <Slide key="why-stop" eyebrow="Next to your main worktree" title="Why people stop">
    <ol className="grid grid-cols-2 gap-[3cqw]">
      {reasons.map(({ title, text }, i) => (
        <li key={title} className="space-y-[1.2cqw] border-t border-foreground pt-[1.5cqw]">
          <span className="font-heading text-[1.7cqw] leading-none text-muted-foreground tabular-nums">0{i + 1}</span>
          <p className="font-heading text-[3.4cqw] leading-[0.95] text-balance uppercase">{title}</p>
          <p className="max-w-[38cqw] text-[1.7cqw] leading-snug">{text}</p>
        </li>
      ))}
    </ol>
  </Slide>,

  <Slide key="claude" eyebrow="Claude's worktree feature" title="What does claude -w do?">
    <FileExplorer root={{ name: "code", open: true, children: [clone()] }} command={claudeWorktree} />
  </Slide>,

  <Slide key="bare" eyebrow="The bare root" title="What is a bare repo?">
    <FileExplorer root={emptyRoot} command={bareClone} text />
    <p className="max-w-[62cqw] text-[2.4cqw] leading-tight italic">
      A bare repo is the git data without a worktree.{" "}
      <Highlight>It&apos;s made for hosting, where nobody works in the files.</Highlight>
    </p>
  </Slide>,

  <Slide key="setup" eyebrow="The bare root" title="Bare repo & linked worktrees">
    <FileExplorer root={bareRoot()} command={dispatch} />
  </Slide>,

  <TitleSlide
    key="demo"
    title={<Highlight>Demo</Highlight>}
    subtitle="A bare root from scratch, and seeing it work."
    corner={
      <Guest
        name="Rune"
        face="/rune.png"
        tabs={[
          {
            label: "Diagram",
            content: (
              <ZoomImage
                src="/parallel-agents.png"
                alt="Parallel agent development with Claude: an orchestrator spawns a refiner and an implementer per task, with a human review at every gate"
                width={2000}
                height={1280}
              />
            ),
          },
          {
            label: "AGENTS.md",
            content: (
              <div className="mx-auto max-w-[70cqw] p-[3cqw]">
                <Markdown content={readFileSync(join(process.cwd(), "public/rune-AGENTS.md"), "utf8")} />
              </div>
            ),
          },
        ]}
      />
    }
  />,
]

export default function Slides() {
  return <Deck slides={slides} />
}
