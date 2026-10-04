import { readFileSync } from "node:fs"
import { join } from "node:path"
import Link from "next/link"
import { ArrowRightIcon, DownloadSimpleIcon, SparkleIcon, TerminalWindowIcon } from "@phosphor-icons/react/ssr"
import { CodeBlock } from "@/components/code-block"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// Written from GUIDE.md — keep the two in line.

const agentsTemplate = readFileSync(join(process.cwd(), "public", "AGENTS.md"), "utf8")

function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-muted px-1.5 py-0.5 font-mono text-[0.85em] normal-case">{children}</code>
}

function Step({ number, title, children }: { number: number; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="group relative pb-14 pl-16 last:pb-0">
      <div className="absolute top-10 bottom-0 left-5 w-px bg-border group-last:hidden" />
      <div className="dark absolute top-0 left-0 flex size-10 items-center justify-center bg-background font-heading text-xl text-highlight tabular-nums">
        0{number}
      </div>
      <h3 className="pt-2.5 font-heading text-2xl leading-none uppercase">{title}</h3>
      <div className="mt-5 space-y-4 text-lg">{children}</div>
    </li>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-heading text-5xl leading-none uppercase">{children}</h2>
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5 border-t pt-8">
      <h3 className="font-heading text-2xl leading-tight uppercase">{title}</h3>
      <div className="space-y-4 text-lg">{children}</div>
    </div>
  )
}

const paths = [
  {
    id: "skill",
    icon: SparkleIcon,
    title: "With a skill",
    description: "Install a user-scoped skill once, and Claude sets up any repo for you.",
  },
  {
    id: "manual",
    icon: TerminalWindowIcon,
    title: "Manual",
    description: "Run every command yourself, one at a time.",
  },
] as const

type PathId = (typeof paths)[number]["id"]

function PathPicker({ selected }: { selected: PathId }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {paths.map(({ id, icon: Icon, title, description }) => {
        const active = id === selected
        return (
          <Link
            key={id}
            href={`?path=${id}`}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex gap-4 border p-5 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              active ? "dark border-background bg-background text-foreground" : "hover:border-foreground",
            )}
          >
            <Icon className={cn("size-8 shrink-0", active && "text-highlight")} />
            <div className="space-y-2">
              <p className="flex items-center gap-2 pt-1 font-heading text-2xl leading-none uppercase">
                {title}
                {!active && <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-1" />}
              </p>
              <p>{description}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

const skillFiles = [
  { name: "SKILL.md", href: "/skills/bare-root/SKILL.md", description: "The setup steps Claude follows." },
  { name: "AGENTS.md", href: "/AGENTS.md", description: "The orchestration file it copies into the root." },
]

function SkillSteps() {
  return (
    <ol>
      <Step number={1} title="Install the skill">
        <p>
          Download both files into <Code>~/.claude/skills/bare-root/</Code>. That installs the skill for your user,
          so it works in every folder.
        </p>
        <Card>
          {skillFiles.map(({ name, href, description }) => (
            <CardHeader key={name}>
              <CardTitle className="font-mono">{name}</CardTitle>
              <CardDescription>{description}</CardDescription>
              <CardAction>
                <Button variant="outline" size="sm" nativeButton={false} render={<a href={href} download />}>
                  <DownloadSimpleIcon data-icon="inline-start" />
                  Download
                </Button>
              </CardAction>
            </CardHeader>
          ))}
        </Card>
      </Step>

      <Step number={2} title="Run it">
        <p>Start Claude in the folder where you keep your code, and run the skill with the repo:</p>
        <div className="space-y-2">
          <CodeBlock code={"claude"} />
          <CodeBlock code={"/bare-root <repo-url>"} />
        </div>
        <p>
          It asks which branches to check out, then clones the repo, adds the worktrees, and fills in{" "}
          <Code>AGENTS.md</Code> for you.
        </p>
      </Step>

      <Step number={3} title="Start dispatching">
        <p>Start Claude in the new root and give it a task:</p>
        <div className="space-y-2">
          <CodeBlock code={"cd <folder>"} />
          <CodeBlock code={"claude"} />
        </div>
      </Step>
    </ol>
  )
}

function ManualSteps() {
  return (
    <ol>
      <Step number={1} title="Make the project folder">
        <div className="space-y-2">
          <CodeBlock code={"mkdir my-project"} />
          <CodeBlock code={"cd my-project"} />
        </div>
      </Step>

      <Step
        number={2}
        title={
          <>
            Clone the repo bare into <Code>.git</Code>
          </>
        }
      >
        <p>
          Cloning into <Code>.git</Code> keeps the repo&apos;s internals in one hidden folder, instead of spreading
          them across the project folder the way a plain <Code>git clone --bare</Code> does.
        </p>
        <CodeBlock code={"git clone --bare <repo-url> .git"} />
        <p>A bare clone doesn&apos;t set up fetching of remote branches, so add that and fetch:</p>
        <div className="space-y-2">
          <CodeBlock code={'git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"'} />
          <CodeBlock code={"git fetch origin"} />
        </div>
      </Step>

      <Step number={3} title="Add the orchestration file">
        <p>
          Download <Code>AGENTS.md</Code> into the root. Then point Claude at it by creating a <Code>CLAUDE.md</Code>{" "}
          next to it containing just this line:
        </p>
        <CodeBlock code={"@AGENTS.md"} />
        <p>
          Fill in the Configuration section at the bottom of <Code>AGENTS.md</Code> so it matches your project: the
          root path, remote, base branch, how a fresh worktree is set up, and how to open a new terminal tab. You can
          ask Claude in the root to fill it in for you.
        </p>
        <Card>
          <CardHeader>
            <CardTitle className="font-mono">AGENTS.md</CardTitle>
            <CardDescription>The dispatcher instructions for the bare root.</CardDescription>
            <CardAction>
              <Button variant="outline" size="sm" nativeButton={false} render={<a href="/AGENTS.md" download />}>
                <DownloadSimpleIcon data-icon="inline-start" />
                Download
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80 bg-muted">
              <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-foreground">
                {agentsTemplate}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </Step>

      <Step number={4} title="Add the worktrees that always matter">
        <p>
          Check out the long-lived branches the project revolves around, like the dev branch, the production branch,
          or the latest release branch:
        </p>
        <div className="space-y-2">
          <CodeBlock code={"git worktree add -B development --track worktrees/development origin/development"} />
          <CodeBlock code={"git worktree add -B main --track worktrees/main origin/main"} />
        </div>
      </Step>

      <Step number={5} title="Start dispatching">
        <CodeBlock code={"claude"} />
        <p>Give it a task. It creates a worktree, writes a brief, and opens a new session in that worktree.</p>
      </Step>
    </ol>
  )
}

function Faq() {
  return (
    <section className="space-y-8">
      <SectionTitle>FAQ</SectionTitle>

      <Question title={'Git fails with "Filename too long" on Windows'}>
        <p>
          Windows limits paths to 260 characters by default. Worktrees sit a few folders deeper than a normal checkout
          (<Code>my-project/worktrees/&lt;name&gt;/…</Code>), so long paths, often in <Code>node_modules</Code>, go
          over the limit. Tell git to allow long paths:
        </p>
        <CodeBlock code={"git config --global core.longpaths true"} />
      </Question>

      <Question title="A git hook behaves differently in a worktree">
        <p>
          When git runs a hook, it sets environment variables like <Code>GIT_DIR</Code> for it. In a linked worktree,{" "}
          <Code>GIT_DIR</Code> points to the worktree&apos;s own git folder (<Code>.git/worktrees/&lt;name&gt;</Code>),
          and with <Code>GIT_DIR</Code> set but no <Code>GIT_WORK_TREE</Code>, git treats the current directory as the
          root of the work tree. Tools that run git from a subfolder then get the wrong root. Turbo, for example, runs
          git from each package folder to hash its inputs, mistakes every package for the repo root, and hangs.
        </p>
        <p>Clear git&apos;s variables at the top of the hook, so tools find the work tree the normal way:</p>
        <CodeBlock code={"unset $(git rev-parse --local-env-vars)"} />
        <p>
          <Code>git rev-parse --local-env-vars</Code> prints git&apos;s own list of these variables. The{" "}
          <a
            href="https://git-scm.com/docs/githooks"
            className="underline underline-offset-4 hover:decoration-2"
            target="_blank"
            rel="noreferrer"
          >
            githooks docs
          </a>{" "}
          mention the same: hooks that run git in another repository should clear them.
        </p>
      </Question>
    </section>
  )
}

export default async function Setup({ searchParams }: { searchParams: Promise<{ path?: string }> }) {
  const { path } = await searchParams
  const selected: PathId = path === "manual" ? "manual" : "skill"

  return (
    <>
      <PageHeader
        title="Set it up"
        description="One folder that holds the repo and all its worktrees, with Claude working from the root as a dispatcher."
      />

      <main className="mx-auto max-w-3xl space-y-20 px-6 pt-12 pb-24">
        <section className="space-y-12">
          <PathPicker selected={selected} />
          {selected === "skill" ? <SkillSteps /> : <ManualSteps />}
        </section>

        <Faq />
      </main>
    </>
  )
}
