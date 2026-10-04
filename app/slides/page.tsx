import { notFound } from "next/navigation"
import { Highlight } from "@/components/highlight"
import { Deck } from "@/components/slides/deck"
import { Slide, TitleSlide } from "@/components/slides/slide"
import { showSlides } from "@/flags"

// Written from SLIDES.md — keep the two in line.

const about = [
  { label: "Role", value: "Frontend engineer" },
  { label: "At IMPACT", value: "3 years" },
  { label: "Team", value: "Accelerator" },
]

const tasks = ["Task A", "Task B", "Task C"]

const agenda = [
  { title: "The foundation", description: "Understanding the technology" },
  { title: "Next to your main worktree", description: "Adding worktrees alongside the checkout you already have" },
  { title: "Claude's worktree feature", description: "How it works when Claude makes the worktrees" },
  { title: "The bare root", description: "A space above the worktrees where we start Claude and let it orchestrate" },
]

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-heading text-[1.25cqw] tracking-wide text-muted-foreground uppercase">{children}</p>
}

function TaskBar({ label, offset = 0 }: { label: string; offset?: number }) {
  return (
    <div
      className="flex h-[3.2cqw] w-[30%] items-center bg-foreground px-[1cqw] font-heading text-[1.25cqw] text-background uppercase"
      style={{ marginLeft: `${offset}%` }}
    >
      {label}
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
    <div className="grid grid-cols-2 gap-[5cqw]">
      <div className="space-y-[1.2cqw]">
        <Label>One task at a time</Label>
        <div className="flex gap-[5%]">
          {tasks.map((task) => (
            <TaskBar key={task} label={task} />
          ))}
        </div>
      </div>
      <div className="space-y-[1.2cqw]">
        <Label>In parallel</Label>
        <div className="space-y-[0.6cqw]">
          {tasks.map((task) => (
            <TaskBar key={task} label={task} />
          ))}
        </div>
      </div>
    </div>
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
