import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-3xl space-y-8 px-6 pt-8 pb-14">
        <Button variant="ghost" size="sm" className="-ml-2.5 text-muted-foreground" nativeButton={false} render={<Link href="/" />}>
          <ArrowLeftIcon data-icon="inline-start" />
          Back
        </Button>
        <div className="space-y-4">
          <h1 className="font-heading text-5xl font-semibold tracking-wide uppercase">{title}</h1>
          {description && <p className="max-w-2xl font-serif text-2xl text-muted-foreground italic">{description}</p>}
        </div>
      </div>
    </header>
  )
}
