"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "@phosphor-icons/react/ssr"
import { Button } from "@/components/ui/button"

// For a whole file, next to its Download button, for people who'd rather paste it in.
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button variant="outline" size="sm" onClick={copy}>
      {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  )
}
