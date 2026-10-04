import Link from "next/link"
import { ArrowRightIcon, CircleHelpIcon, PresentationIcon, WrenchIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showSlides } from "@/flags"

export default async function Home() {
  const cards = [
    {
      href: "/slides",
      icon: PresentationIcon,
      title: "Slides",
      description: "Go through the presentation.",
      enabled: await showSlides(),
    },
    {
      href: "/setup",
      icon: WrenchIcon,
      title: "Set it up",
      description: "A bare root, the orchestration file, and your first worktrees. With a skill or by hand.",
      enabled: true,
    },
    {
      href: "/faq",
      icon: CircleHelpIcon,
      title: "FAQ",
      description: "Long paths on Windows, git hooks in worktrees, and other snags.",
      enabled: true,
    },
  ]

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center gap-10 px-6 py-16">
      <div className="space-y-3">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Worktrees</h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          One repo, many worktrees, and Claude dispatching work from the root.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ href, icon: Icon, title, description, enabled }) => {
          const card = (
            <Card className={enabled ? "h-full transition-shadow group-hover:shadow-md" : "h-full opacity-60"}>
              <CardHeader className="gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-accent">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="flex items-center gap-1.5 text-lg">
                  {title}
                  {enabled ? (
                    <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  ) : (
                    <Badge variant="secondary">Coming soon</Badge>
                  )}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          )

          return enabled ? (
            <Link key={href} href={href} className="group rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              {card}
            </Link>
          ) : (
            <div key={href} aria-disabled>
              {card}
            </div>
          )
        })}
      </div>
    </main>
  )
}
