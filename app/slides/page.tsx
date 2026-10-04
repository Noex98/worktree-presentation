import { notFound } from "next/navigation"
import { Deck } from "@/components/slides/deck"
import { Slide } from "@/components/slides/slide"
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

function TaskBar({ label, offset = 0 }: { label: string; offset?: number }) {
  return (
    <div
      className="flex h-10 w-[30%] items-center rounded-md bg-foreground px-3 text-sm font-medium text-background"
      style={{ marginLeft: `${offset}%` }}
    >
      {label}
    </div>
  )
}

const slides = [
  <Slide key="title" className="gap-6">
    <h1 className="font-heading text-8xl font-semibold tracking-wide uppercase lg:text-9xl">
      <span className="bg-accent px-2">Work</span>trees
    </h1>
    <p className="max-w-2xl font-serif text-4xl text-muted-foreground italic">
      One repo, many worktrees, and Claude dispatching work from the root.
    </p>
  </Slide>,

  <Slide key="about" eyebrow="About me" title="Johannes">
    <dl className="grid gap-8 sm:grid-cols-3">
      {about.map(({ label, value }) => (
        <div key={label} className="space-y-2 border-t pt-4">
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="text-2xl font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  </Slide>,

  <Slide key="why" eyebrow="Why now" title="Agentic work has made worktrees more relevant than ever">
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">One task at a time</p>
        <div className="flex gap-[5%]">
          {tasks.map((task) => (
            <TaskBar key={task} label={task} />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">In parallel</p>
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskBar key={task} label={task} />
          ))}
        </div>
      </div>
    </div>
    <p className="max-w-3xl font-serif text-3xl text-muted-foreground italic">
      We need a way for agents to work on multiple tasks in parallel, to eliminate the waiting time we have as
      developers.
    </p>
  </Slide>,

  <Slide key="agenda" eyebrow="Agenda" title="Most of us know worktrees. But there are many ways of working with them.">
    <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {agenda.map(({ title, description }, i) => (
        <li key={title} className="flex gap-5 border-t pt-4">
          <span className="font-mono text-sm text-muted-foreground tabular-nums">0{i + 1}</span>
          <div className="space-y-1">
            <p className="text-xl font-medium">{title}</p>
            <p className="text-muted-foreground">{description}</p>
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
