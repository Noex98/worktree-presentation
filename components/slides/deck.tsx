"use client"

import { createContext, use, useCallback, useEffect, useState } from "react"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr"
import { cn } from "@/lib/utils"

const NEXT_KEYS = ["ArrowRight", "ArrowDown", "PageDown", " "]
const PREV_KEYS = ["ArrowLeft", "ArrowUp", "PageUp"]

const DeckContext = createContext<{ index: number; count: number; go: (to: number) => void } | null>(null)

export function Deck({ slides }: { slides: React.ReactNode[] }) {
  const [index, setIndex] = useState(0)
  const last = slides.length - 1

  // Keeps the slide in the URL hash (#1, #2, …), so a refresh keeps your place. The hash is written
  // here rather than in an effect on `index`, which would overwrite it with #1 on mount, before
  // Strict Mode's second run of the effect below reads it.
  const go = useCallback(
    (to: number) => {
      const next = Math.min(Math.max(to, 0), last)
      setIndex(next)
      window.history.replaceState(null, "", `#${next + 1}`)
    },
    [last],
  )

  useEffect(() => {
    const fromHash = Number(window.location.hash.slice(1))
    if (Number.isInteger(fromHash) && fromHash >= 1) go(fromHash - 1)
  }, [go])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (NEXT_KEYS.includes(event.key)) go(index + 1)
      else if (PREV_KEYS.includes(event.key)) go(index - 1)
      else if (event.key === "Home") go(0)
      else if (event.key === "End") go(last)
      else return
      event.preventDefault()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [go, index, last])

  return (
    <DeckContext value={{ index, count: slides.length, go }}>
      <main className="flex h-svh items-center justify-center overflow-hidden bg-black">
        {/* A 16:9 stage, like the template's slides. Slides size everything in cqw, so they scale with it. */}
        <div className="@container relative aspect-video w-[min(100vw,calc(100svh*16/9))] overflow-hidden">
          {/* Every slide stays mounted, so each keeps its state, and only the current one is shown: slides
              change with a plain cut. */}
          {slides.map((slide, i) => (
            <div key={i} inert={i !== index} className={cn("absolute inset-0", i !== index && "hidden")}>
              {slide}
            </div>
          ))}
        </div>
      </main>
    </DeckContext>
  )
}

// The slide number and arrows. Each slide layout places it, so it takes that slide's colours.
export function SlideNav() {
  const deck = use(DeckContext)
  if (!deck) return null
  const { index, count, go } = deck

  const button =
    "flex size-[2.4cqw] items-center justify-center outline-none transition-colors hover:text-foreground focus-visible:text-foreground disabled:pointer-events-none disabled:opacity-40 dark:hover:text-highlight dark:focus-visible:text-highlight"

  return (
    <div className="flex items-center gap-[0.4cqw] font-heading text-[1.15cqw] text-muted-foreground">
      <span className="mr-[0.6cqw] tabular-nums">
        {index + 1} / {count}
      </span>
      <button type="button" aria-label="Previous slide" disabled={index === 0} onClick={() => go(index - 1)} className={button}>
        <CaretLeftIcon className="size-[1.5cqw]" />
      </button>
      <button type="button" aria-label="Next slide" disabled={index === count - 1} onClick={() => go(index + 1)} className={button}>
        <CaretRightIcon className="size-[1.5cqw]" />
      </button>
    </div>
  )
}
