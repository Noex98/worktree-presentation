import Link from "next/link"
import { ArrowRightIcon, PresentationIcon, WrenchIcon } from "lucide-react"
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
      description: "With a user-scoped skill or by hand, plus an FAQ for the snags.",
      enabled: true,
    },
  ]

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center gap-12 px-6 py-16">
      <div className="space-y-5">
        <h1 className="font-heading text-6xl font-semibold tracking-wide uppercase sm:text-7xl">
          <span className="bg-accent px-1.5">Work</span>trees
        </h1>
        <p className="max-w-xl font-serif text-2xl text-muted-foreground italic">
          One repo, many worktrees, and Claude dispatching work from the root.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ href, icon: Icon, title, description, enabled }) => {
          const card = (
            <Card
              className={
                enabled
                  ? "h-full border-l-4 border-l-foreground transition-colors group-hover:bg-muted"
                  : "h-full opacity-60"
              }
            >
              <CardHeader className="gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-accent">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="flex items-center gap-1.5 text-xl tracking-wide uppercase">
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
