import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2.5 text-muted-foreground" nativeButton={false} render={<Link href="/" />}>
        <ArrowLeftIcon data-icon="inline-start" />
        Back
      </Button>
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-lg text-muted-foreground">{description}</p>}
      </div>
    </header>
  )
}
