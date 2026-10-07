"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { XIcon } from "@phosphor-icons/react/ssr"
import { cn } from "@/lib/utils"

// A guest's face in a slide's corner, opening what they're showing in a modal, one tab per thing.
export function Guest({ name, face, tabs }: { name: string; face: string; tabs: { label: string; content: React.ReactNode }[] }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [tab, setTab] = useState(0)

  return (
    <>
      <button
        type="button"
        aria-label={`Show ${name}’s setup`}
        onClick={() => dialog.current?.showModal()}
        className="size-[4.5cqw] overflow-hidden outline-none ring-highlight transition-shadow hover:ring-[0.25cqw] focus-visible:ring-[0.25cqw]"
      >
        <Image src={face} alt="" width={512} height={512} className="size-full object-cover" />
      </button>
      {/* Keys stay in the dialog, so the deck's arrow keys don't change slides behind it. Escape still
          closes it, and so does a click on the backdrop. */}
      <dialog
        ref={dialog}
        onKeyDown={(event) => event.stopPropagation()}
        onClick={(event) => event.target === event.currentTarget && dialog.current?.close()}
        className="m-auto h-[92svh] w-[92vw] max-w-none flex-col bg-background p-0 text-foreground backdrop:bg-black/80 open:flex"
      >
        <div className="dark flex shrink-0 items-center bg-background text-foreground">
          <div role="tablist" className="flex flex-1">
            {tabs.map(({ label }, i) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={i === tab}
                onClick={() => setTab(i)}
                className={cn(
                  "px-5 py-3 font-heading text-lg uppercase outline-none transition-colors hover:text-highlight focus-visible:text-highlight",
                  i === tab ? "text-highlight" : "text-muted-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => dialog.current?.close()}
            className="flex size-12 items-center justify-center outline-none transition-colors hover:text-highlight focus-visible:text-highlight"
          >
            <XIcon className="size-6" />
          </button>
        </div>
        <div role="tabpanel" className="min-h-0 flex-1 overflow-auto">
          {tabs[tab].content}
        </div>
      </dialog>
    </>
  )
}
