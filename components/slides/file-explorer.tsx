"use client"

import { useCallback, useEffect, useState } from "react"
import {
  ArrowCounterClockwiseIcon,
  ArrowsOutIcon,
  CaretDownIcon,
  CaretRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  PlayIcon,
  QuestionIcon,
  XIcon,
} from "@phosphor-icons/react/ssr"
import { Markdown } from "@/components/slides/markdown"
import { cn } from "@/lib/utils"

export type Entry = {
  name: string
  // Folders have children, files have content.
  children?: Entry[]
  content?: string
  // Shown above a file's content, for files git stores in a form you wouldn't see as is.
  note?: string
  // A label after the name, like "main worktree".
  tag?: string
  open?: boolean
  // Made by the command, so it's tagged as new.
  added?: boolean
  // Gitignored, so it's greyed out, like editors show it. Applies to everything inside a folder too.
  ignored?: boolean
}

// A command shown above the explorer. Clicking it runs it, and the tree becomes `result`; clicking it
// again undoes it. `help` explains the command in a modal: where it branches from, and its options.
// `cycle` lists other ways to write the same command, which the bar takes turns showing.
export type Command = { cwd: string; run: string; cycle?: string[]; result: Entry; help?: Help }

export type Help = { summary: string; items: { label: string; text: string; code?: string }[] }

// A file explorer for slides: a tree on the left, where folders open and close and files open on the right.
// `text` says the slide has text under the explorer, which slides with a command usually don't.
export function FileExplorer({
  root: initial,
  command,
  text = !command,
}: {
  root: Entry
  command?: Command
  text?: boolean
}) {
  const [ran, setRan] = useState(false)
  const [helping, setHelping] = useState(false)
  const [reading, setReading] = useState(false)
  const root = ran && command ? command.result : initial
  const runs = command ? [command.run, ...(command.cycle ?? [])] : []
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (runs.length < 2) return
    const timer = setInterval(() => setShown((shown) => (shown + 1) % runs.length), 2200)
    return () => clearInterval(timer)
  }, [runs.length])
  const [open, setOpen] = useState(() => openPaths(initial))
  const [selected, setSelected] = useState<string>()
  const file = paths(root).find(([path]) => path === selected)?.[1]

  function toggle(path: string) {
    setOpen((open) => {
      const next = new Set(open)
      if (!next.delete(path)) next.add(path)
      return next
    })
  }

  function run(command: Command) {
    setRan(true)
    setOpen((open) => new Set([...open, ...openPaths(command.result)]))
  }

  function rows(entry: Entry, path: string, depth: number, inIgnored = false): React.ReactNode {
    const folder = entry.children !== undefined
    const isOpen = open.has(path)
    const ignored = inIgnored || entry.ignored
    const Icon = folder ? (isOpen ? FolderOpenIcon : FolderIcon) : FileIcon
    const Caret = isOpen ? CaretDownIcon : CaretRightIcon
    // A closed folder with something new inside says so, so you know where to look.
    const tag = entry.tag ?? (entry.added ? "New" : folder && !isOpen && hasAdded(entry) ? "Changed" : undefined)

    return (
      <li key={path}>
        <button
          type="button"
          onClick={() => (folder ? toggle(path) : setSelected(path))}
          className={cn(
            "flex w-full items-center gap-[0.5cqw] py-[0.35cqw] pr-[1cqw] text-left outline-none hover:bg-muted focus-visible:bg-muted",
            ignored && "text-muted-foreground",
            path === selected && "bg-foreground text-background hover:bg-foreground focus-visible:bg-foreground",
          )}
          style={{ paddingLeft: `${1 + depth * 1.5}cqw` }}
        >
          <span className="w-[1cqw] shrink-0">{folder && <Caret className="size-[1cqw]" />}</span>
          <Icon className="size-[1.4cqw] shrink-0" />
          <span className="truncate">
            {entry.name}
            {folder && "/"}
          </span>
          {tag && (
            <span className="ml-auto shrink-0 pl-[1cqw] font-heading text-[1.15cqw] text-muted-foreground uppercase">
              {tag}
            </span>
          )}
        </button>
        {folder && isOpen && <ul>{entry.children?.map((child) => rows(child, `${path}/${child.name}`, depth + 1, ignored))}</ul>}
      </li>
    )
  }

  return (
    <>
      <div className="space-y-[1cqw] font-mono text-[1.25cqw] leading-tight">
        {command && (
          <div
            className={cn(
              "dark flex items-center border-[0.15cqw] border-transparent bg-background text-foreground",
              ran && "border-green-500",
            )}
          >
            <button
              type="button"
              aria-label={ran ? "Undo command" : "Run command"}
              onClick={() => (ran ? setRan(false) : run(command))}
              className="flex min-w-0 flex-1 items-center gap-[1cqw] py-[0.6cqw] pl-[1.2cqw] text-left outline-none"
            >
              <span className="flex-1 truncate">
                <span className="text-muted-foreground">{command.cwd}</span> <span className="text-highlight">$</span>{" "}
                <span key={shown} className="inline-block animate-in duration-500 fade-in slide-in-from-bottom-2">
                  {runs[shown]}
                </span>
              </span>
              {ran ? (
                <ArrowCounterClockwiseIcon className="size-[1.4cqw] shrink-0 text-highlight" />
              ) : (
                <PlayIcon className="size-[1.4cqw] shrink-0 text-highlight" />
              )}
            </button>
            {command.help && (
              <button
                type="button"
                aria-label="About this command"
                onClick={() => setHelping(true)}
                className="px-[1.2cqw] py-[0.6cqw] text-muted-foreground outline-none hover:text-highlight focus-visible:text-highlight"
              >
                <QuestionIcon className="size-[1.4cqw]" />
              </button>
            )}
          </div>
        )}
        {/* Without text under it, the explorer takes that space too; the command bar takes some of it. */}
        <div
          className={cn(
            "grid grid-cols-[38cqw_1fr] grid-rows-[minmax(0,1fr)] border-[0.15cqw] border-foreground",
            !text ? "h-[33cqw]" : command ? "h-[23cqw]" : "h-[27cqw]",
          )}
        >
          <ul className="overflow-y-scroll border-r-[0.15cqw] border-foreground py-[0.6cqw]">{rows(root, root.name, 0)}</ul>
          {file && (
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center border-b-[0.15cqw] border-foreground bg-muted">
                <p className="flex-1 truncate px-[1.5cqw] py-[0.8cqw]">{selected}</p>
                {file.name.endsWith(".md") && (
                  <button
                    type="button"
                    aria-label="Read it bigger"
                    onClick={() => setReading(true)}
                    className="px-[1.2cqw] py-[0.8cqw] text-muted-foreground outline-none hover:text-foreground focus-visible:text-foreground"
                  >
                    <ArrowsOutIcon className="size-[1.4cqw]" />
                  </button>
                )}
              </div>
              <div className="min-h-0 flex-1 space-y-[1cqw] overflow-y-scroll p-[1.5cqw]">
                {file.note && <p className="font-serif text-[1.25cqw] text-muted-foreground italic">{file.note}</p>}
                <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] [tab-size:4]">{file.content}</pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Outside the stack above: as its last child, a modal would give the explorer a bottom margin and
          shift the slide. */}
      {command?.help && helping && <HelpModal command={command} help={command.help} onClose={() => setHelping(false)} />}
      {file?.content !== undefined && reading && (
        <Modal
          label={selected!}
          title={<p className="font-mono text-[1.1cqw] leading-tight text-muted-foreground">{selected}</p>}
          onClose={() => setReading(false)}
          className="max-w-[62cqw]"
        >
          <Markdown content={file.content} />
        </Modal>
      )}
    </>
  )
}

// Covers the whole slide, rather than the window, so it scales with the slide like everything on it.
// Escape, the close button, or a click outside closes it. It fades and scales in, and out again before
// `onClose` unmounts it; with reduced motion it opens and closes at once.
function Modal({
  label,
  title,
  onClose,
  children,
  className,
}: {
  label: string
  title: React.ReactNode
  onClose: () => void
  children: React.ReactNode
  className?: string
}) {
  const [closing, setClosing] = useState(false)

  const close = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) onClose()
    else setClosing(true)
  }, [onClose])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [close])

  return (
    <div
      onClick={close}
      // The panel's animation ends here too; only the backdrop's own ending means the modal is gone.
      onAnimationEnd={(event) => closing && event.target === event.currentTarget && onClose()}
      className={cn(
        "absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-[3cqw] duration-200 ease-out fill-mode-forwards motion-reduce:animate-none",
        closing ? "animate-out fade-out" : "animate-in fade-in",
      )}
    >
      <div
        role="dialog"
        aria-modal
        aria-label={label}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "max-h-full w-full space-y-[2cqw] overflow-y-auto bg-background p-[3cqw] font-serif text-foreground duration-200 ease-out fill-mode-forwards motion-reduce:animate-none",
          closing ? "animate-out fade-out zoom-out-95" : "animate-in fade-in zoom-in-95",
          className,
        )}
      >
        <div className="flex items-center gap-[2cqw]">
          <div className="flex-1">{title}</div>
          <button type="button" aria-label="Close" onClick={close} className="outline-none">
            <XIcon className="size-[1.8cqw]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function HelpModal({ command, help, onClose }: { command: Command; help: Help; onClose: () => void }) {
  return (
    <Modal
      label={command.run}
      title={
        <div className="space-y-[1cqw]">
          <p className="font-mono text-[1.6cqw] leading-tight">{command.run}</p>
          <p className="text-[1.7cqw] leading-snug italic">{help.summary}</p>
        </div>
      }
      onClose={onClose}
    >
      <dl className="grid grid-cols-2 gap-x-[3cqw] empty:hidden">
        {help.items.map(({ label, text, code }) => (
          <div key={label} className="space-y-[0.6cqw] border-t border-foreground py-[1.2cqw]">
            <dt className="font-heading text-[1.5cqw] leading-none uppercase">{label}</dt>
            <dd className="space-y-[0.6cqw] text-[1.3cqw] leading-snug">
              <p>{text}</p>
              {code && (
                <pre className="bg-muted px-[0.8cqw] py-[0.5cqw] font-mono text-[1.1cqw] whitespace-pre-wrap [overflow-wrap:anywhere]">
                  {code}
                </pre>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Modal>
  )
}

function paths(entry: Entry, path = entry.name): [string, Entry][] {
  return [[path, entry], ...(entry.children ?? []).flatMap((child) => paths(child, `${path}/${child.name}`))]
}

function openPaths(root: Entry) {
  return new Set(paths(root).filter(([, entry]) => entry.open).map(([path]) => path))
}

function hasAdded(entry: Entry): boolean {
  return entry.children?.some((child) => child.added || hasAdded(child)) ?? false
}
