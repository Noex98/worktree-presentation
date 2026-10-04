"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={cn("group relative rounded-lg border bg-muted/50", className)}>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={copy}
        aria-label="Copy"
        className="absolute top-2 right-2 bg-background/80 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
      <pre className="overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}
