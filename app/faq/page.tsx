import { CodeBlock } from "@/components/code-block"
import { PageHeader } from "@/components/page-header"

// Written from FAQ.md — keep the two in line.

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">{children}</code>
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-t pt-8">
      <h2 className="font-heading text-xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-4 text-muted-foreground [&_pre]:text-foreground">{children}</div>
    </section>
  )
}

export default function Faq() {
  return (
    <main className="mx-auto max-w-3xl space-y-12 px-6 py-12">
      <PageHeader title="FAQ" description="Problems you might run into after setting up a bare root." />

      <div className="space-y-12">
        <Question title={'Git fails with "Filename too long" on Windows'}>
          <p>
            Windows limits paths to 260 characters by default. Worktrees sit a few folders deeper than a normal
            checkout (<Code>my-project/worktrees/&lt;name&gt;/…</Code>), so long paths, often in{" "}
            <Code>node_modules</Code>, go over the limit. Tell git to allow long paths:
          </p>
          <CodeBlock code={"git config --global core.longpaths true"} />
        </Question>

        <Question title="A git hook behaves differently in a worktree">
          <p>
            When git runs a hook, it sets environment variables like <Code>GIT_DIR</Code> for it. In a linked
            worktree, <Code>GIT_DIR</Code> points to the worktree&apos;s own git folder (
            <Code>.git/worktrees/&lt;name&gt;</Code>), and with <Code>GIT_DIR</Code> set but no{" "}
            <Code>GIT_WORK_TREE</Code>, git treats the current directory as the root of the work tree. Tools that
            run git from a subfolder then get the wrong root. Turbo, for example, runs git from each package
            folder to hash its inputs, mistakes every package for the repo root, and hangs.
          </p>
          <p>Clear git&apos;s variables at the top of the hook, so tools find the work tree the normal way:</p>
          <CodeBlock code={"unset $(git rev-parse --local-env-vars)"} />
          <p>
            <Code>git rev-parse --local-env-vars</Code> prints git&apos;s own list of these variables. The{" "}
            <a
              href="https://git-scm.com/docs/githooks"
              className="text-foreground underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              githooks docs
            </a>{" "}
            mention the same: hooks that run git in another repository should clear them.
          </p>
        </Question>
      </div>
    </main>
  )
}
