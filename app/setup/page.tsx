import { readFileSync } from "node:fs"
import { join } from "node:path"
import Link from "next/link"
import { DownloadIcon, InfoIcon } from "lucide-react"
import { CodeBlock } from "@/components/code-block"
import { PageHeader } from "@/components/page-header"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

// Written from GUIDE.md — keep the two in line.

const agentsTemplate = readFileSync(join(process.cwd(), "public", "AGENTS.md"), "utf8")

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">{children}</code>
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <li className="group relative pb-12 pl-12 last:pb-0">
      <div className="absolute top-8 bottom-0 left-[15px] w-px bg-border group-last:hidden" />
      <div className="absolute top-0 left-0 flex size-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-accent">
        {number}
      </div>
      <h3 className="pt-1 font-heading text-xl font-semibold tracking-tight">{title}</h3>
      <div className="mt-4 space-y-4 text-muted-foreground [&_pre]:text-foreground">{children}</div>
    </li>
  )
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="space-y-8 border-t pt-10">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

const skillFiles = [
  { name: "SKILL.md", href: "/skills/bare-root/SKILL.md", description: "The setup steps Claude follows." },
  { name: "AGENTS.md", href: "/AGENTS.md", description: "The orchestration file it copies into the root." },
]

export default function Setup() {
  return (
    <main className="mx-auto max-w-3xl space-y-12 px-6 py-12">
      <PageHeader
        title="Set it up"
        description="One folder that holds the repo and all its worktrees, with Claude working from the root as a dispatcher."
      />

      <Section
        title="With the skill"
        description="Install a skill once, and Claude sets up any repo as a bare root for you."
      >
        <ol>
          <Step number={1} title="Install the skill">
            <p>
              Download both files into <Code>~/.claude/skills/bare-root/</Code>. That installs the skill for your
              user, so it works in every folder.
            </p>
            <Card>
              {skillFiles.map(({ name, href, description }) => (
                <CardHeader key={name}>
                  <CardTitle className="font-mono">{name}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                  <CardAction>
                    <Button variant="outline" size="sm" nativeButton={false} render={<a href={href} download />}>
                      <DownloadIcon data-icon="inline-start" />
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
      </Section>

      <Section title="By hand" description="The same setup, one command at a time.">
        <ol>
          <Step number={1} title="Make the project folder">
            <div className="space-y-2">
              <CodeBlock code={"mkdir my-project"} />
              <CodeBlock code={"cd my-project"} />
            </div>
          </Step>

          <Step number={2} title="Clone the repo bare into .git">
            <p>
              Cloning into <Code>.git</Code> keeps the repo&apos;s internals in one hidden folder, instead of
              spreading them across the project folder the way a plain <Code>git clone --bare</Code> does.
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
              Download <Code>AGENTS.md</Code> into the root. Then point Claude at it by creating a{" "}
              <Code>CLAUDE.md</Code> next to it containing just this line:
            </p>
            <CodeBlock code={"@AGENTS.md"} />
            <p>
              Fill in the Configuration section at the bottom of <Code>AGENTS.md</Code> so it matches your
              project: the root path, remote, base branch, how a fresh worktree is set up, and how to open a new
              terminal tab. You can ask Claude in the root to fill it in for you.
            </p>
            <Card>
              <CardHeader>
                <CardTitle className="font-mono">AGENTS.md</CardTitle>
                <CardDescription>The dispatcher instructions for the bare root.</CardDescription>
                <CardAction>
                  <Button variant="outline" size="sm" nativeButton={false} render={<a href="/AGENTS.md" download />}>
                    <DownloadIcon data-icon="inline-start" />
                    Download
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80 rounded-lg border bg-muted/50">
                  <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-foreground">
                    {agentsTemplate}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </Step>

          <Step number={4} title="Add the worktrees that always matter">
            <p>
              Check out the long-lived branches the project revolves around, like the dev branch, the production
              branch, or the latest release branch:
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
      </Section>

      <Alert>
        <InfoIcon />
        <AlertDescription>
          <p>
            On Windows, or seeing git hooks act up in a worktree? See the{" "}
            <Link href="/faq" className="text-foreground underline underline-offset-4">
              FAQ
            </Link>
            .
          </p>
        </AlertDescription>
      </Alert>
    </main>
  )
}
