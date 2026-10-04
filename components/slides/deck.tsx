"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const NEXT_KEYS = ["ArrowRight", "ArrowDown", "PageDown", " "]
const PREV_KEYS = ["ArrowLeft", "ArrowUp", "PageUp"]

export function Deck({ slides }: { slides: React.ReactNode[] }) {
  const [index, setIndex] = useState(0)
  const last = slides.length - 1

  const go = useCallback((to: number) => setIndex(Math.min(Math.max(to, 0), last)), [last])

  // Start on the slide in the URL hash (#1, #2, …), so a refresh keeps your place.
  useEffect(() => {
    const fromHash = Number(window.location.hash.slice(1))
    if (Number.isInteger(fromHash) && fromHash >= 1) go(fromHash - 1)
  }, [go])

  useEffect(() => {
    window.history.replaceState(null, "", `#${index + 1}`)
  }, [index])

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
    <main className="dark flex h-svh flex-col overflow-hidden bg-background text-foreground">
      <div className="h-1 bg-muted">
        <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${((index + 1) / slides.length) * 100}%` }} />
      </div>

      <div key={index} className="flex flex-1 items-center overflow-y-auto py-12 animate-in fade-in duration-300">
        {slides[index]}
      </div>

      <footer className="flex items-center justify-between px-6 pb-5 text-sm text-muted-foreground">
        <Button variant="ghost" size="sm" className="text-muted-foreground" nativeButton={false} render={<Link href="/" />}>
          <ArrowLeftIcon data-icon="inline-start" />
          Home
        </Button>
        <div className="flex items-center gap-1">
          <span className="mr-2 tabular-nums">
            {index + 1} / {slides.length}
          </span>
          <Button variant="ghost" size="icon-sm" aria-label="Previous slide" disabled={index === 0} onClick={() => go(index - 1)}>
            <ChevronLeftIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Next slide" disabled={index === last} onClick={() => go(index + 1)}>
            <ChevronRightIcon />
          </Button>
        </div>
      </footer>
    </main>
  )
}
