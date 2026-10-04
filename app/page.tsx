import Link from "next/link"
import { ArrowRightIcon } from "@phosphor-icons/react/ssr"
import { Highlight } from "@/components/highlight"
import { ImpactLogo } from "@/components/impact-logo"
import { showSlides } from "@/flags"
import { cn } from "@/lib/utils"

export default async function Home() {
  const links = [
    {
      href: "/slides",
      title: "Slides",
      description: "Go through the presentation.",
      enabled: await showSlides(),
    },
    {
      href: "/setup",
      title: "Set it up",
      description: "With a user-scoped skill or by hand, plus an FAQ for the snags.",
      enabled: true,
    },
  ]

  const row = "grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 px-4 py-7 sm:grid-cols-[3.5rem_1fr_auto]"
  const number = "self-start pt-1 font-heading text-xl tabular-nums"

  return (
    <main className="grid min-h-svh lg:grid-cols-[5fr_7fr]">
      {/* Laid out like the template's agenda slide: a black panel, the one place the yellow can go. */}
      <section className="dark flex min-h-[55svh] flex-col justify-between gap-16 bg-background p-6 text-foreground sm:p-10 lg:min-h-svh">
        <ImpactLogo className="w-24" />
        <div className="@container">
          <h1 className="font-heading text-[22cqw] leading-[0.85] uppercase">
            <Highlight>Work</Highlight>trees
          </h1>
        </div>
      </section>

      <div className="flex flex-col justify-center gap-14 px-6 py-16 sm:px-10 lg:px-16">
        <p className="max-w-xl text-2xl leading-snug italic sm:text-3xl">
          One repo, many worktrees, and Claude dispatching work from the root.
        </p>

        <ol className="-mx-4 max-w-2xl border-t">
          {links.map(({ href, title, description, enabled }, i) => {
            const text = (
              <span className="space-y-2">
                <span className="block font-heading text-4xl leading-none uppercase sm:text-5xl">{title}</span>
                <span className="block text-lg">{description}</span>
              </span>
            )

            return (
              <li key={href} className="border-b">
                {enabled ? (
                  <Link
                    href={href}
                    className={cn(
                      row,
                      "group outline-none transition-colors hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background",
                    )}
                  >
                    <span
                      className={cn(
                        number,
                        "text-muted-foreground transition-colors group-hover:text-impact-yellow group-focus-visible:text-impact-yellow",
                      )}
                    >
                      0{i + 1}
                    </span>
                    {text}
                    <ArrowRightIcon className="size-8 transition group-hover:translate-x-1 group-hover:text-impact-yellow group-focus-visible:text-impact-yellow" />
                  </Link>
                ) : (
                  <div aria-disabled className={cn(row, "text-muted-foreground")}>
                    <span className={number}>0{i + 1}</span>
                    {text}
                    <span className="font-heading text-sm tracking-wide uppercase">Coming soon</span>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </main>
  )
}
