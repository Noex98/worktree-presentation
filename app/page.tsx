import Link from "next/link"
import { ArrowRightIcon, PresentationIcon, WrenchIcon } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const cards = [
  {
    href: "/slides",
    icon: PresentationIcon,
    title: "Slides",
    description: "Go through the presentation.",
  },
  {
    href: "/setup",
    icon: WrenchIcon,
    title: "Set it up",
    description: "Step by step: a bare root, the orchestration file, and your first worktrees.",
  },
]

export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center gap-10 px-6 py-16">
      <div className="space-y-3">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Worktrees</h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          One repo, many worktrees, and Claude dispatching work from the root.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href} className="group rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader className="gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="flex items-center gap-1.5 text-lg">
                  {title}
                  <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
