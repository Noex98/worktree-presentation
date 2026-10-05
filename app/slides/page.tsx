import { Fragment } from "react"
import { notFound } from "next/navigation"
import { Highlight } from "@/components/highlight"
import { Deck } from "@/components/slides/deck"
import { Slide, TitleSlide } from "@/components/slides/slide"
import { showSlides } from "@/flags"
import { cn } from "@/lib/utils"

// Written from SLIDES.md — keep the two in line.

const about = [
  { label: "Role", value: "Frontend engineer" },
  { label: "At IMPACT", value: "3 years" },
  { label: "Team", value: "Accelerator" },
]

// An hour of work, in minutes. Your time is one thread either way: you start every task and follow up
// when it's done. With one worktree you wait while the agent works. With many, the agents work side by
// side, and each gets a bigger task, so following up on them doesn't take all your time.
type Span = [from: number, to: number, note?: string]

const HOUR = 60

const timeline: { title: string; lanes: { label: string; you?: Span[]; agent?: Span[]; waiting?: Span[] }[] }[] = [
  {
    title: "One worktree",
    lanes: [
      {
        label: "You",
        you: [[0, 3], [15, 18], [30, 33], [45, 48]],
        waiting: [[3, 15], [18, 30], [33, 45], [48, 60]],
      },
      { label: "Agent", agent: [[3, 15], [18, 30], [33, 45], [48, 60]] },
    ],
  },
  {
    title: "Many worktrees",
    lanes: [
      { label: "You", you: [[0, 3], [3, 6], [6, 9], [42, 45], [45, 48], [48, 51]] },
      { label: "Agent 1", agent: [[3, 42, "bigger task"], [45, 60]] },
      { label: "Agent 2", agent: [[6, 45, "bigger task"], [48, 60]] },
      { label: "Agent 3", agent: [[9, 48, "bigger task"], [51, 60]] },
    ],
  },
]

const agenda = [
  { title: "The foundation", description: "Understanding the technology" },
  { title: "Next to your main worktree", description: "Adding worktrees alongside the checkout you already have" },
  { title: "Claude's worktree feature", description: "How it works when Claude makes the worktrees" },
  { title: "The bare root", description: "A space above the worktrees where we start Claude and let it orchestrate" },
]

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-heading text-[1.25cqw] tracking-wide text-muted-foreground uppercase", className)}>{children}</p>
  )
}

// Swimlanes on a shared time axis: black is you starting or following up on a task, grey is an agent
// working, and light grey is you waiting.
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
          {lanes.map(({ label, you = [], agent = [], waiting = [] }) => (
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
                {waiting.map((span) => (
                  <div key={span[0]} className={cn(block, "bg-muted text-[1.15cqw] italic")} style={at(span)}>
                    waiting
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
        <Highlight>Work</Highlight>trees
      </>
    }
    subtitle="One repo, many worktrees, and Claude dispatching work from the root."
  />,

  <Slide key="about" eyebrow="About me" title="Johannes" className="justify-end">
    <dl className="grid grid-cols-3 gap-[3cqw]">
      {about.map(({ label, value }) => (
        <div key={label} className="space-y-[1cqw] border-t border-foreground pt-[1.2cqw]">
          <dt>
            <Label>{label}</Label>
          </dt>
          <dd className="font-heading text-[2.9cqw] leading-none uppercase">{value}</dd>
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
]

export default async function Slides() {
  if (!(await showSlides())) notFound()

  return <Deck slides={slides} />
}
