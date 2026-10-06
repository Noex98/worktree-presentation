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
      title: "Bare repo setup",
      description: "With a user-scoped skill or by hand, plus an FAQ for the snags.",
      enabled: true,
    },
  ]

  // The panel's headline grows with the screen, so on wide screens the links grow along with it.
  const row =
    "grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 px-4 py-7 sm:grid-cols-[3.5rem_1fr_auto] 2xl:grid-cols-[4.5rem_1fr_auto] 2xl:py-9 min-[2400px]:grid-cols-[5.5rem_1fr_auto] min-[2400px]:py-11"
  const number = "self-start pt-1 font-heading text-xl tabular-nums 2xl:text-2xl min-[2400px]:text-3xl"

  return (
    <main className="grid min-h-svh lg:grid-cols-[5fr_7fr]">
      {/* Laid out like the template's agenda slide: a black panel, the one place the yellow can go. */}
      <section className="dark flex min-h-[55svh] flex-col justify-between gap-16 bg-background p-6 text-foreground sm:p-10 lg:min-h-svh">
        <ImpactLogo className="w-24 2xl:w-32 min-[2400px]:w-40" />
        <div className="@container">
          <h1 className="font-heading text-[13cqw] leading-[0.85] uppercase">
            Git <Highlight>Worktrees</Highlight> and Agent Orchestration
          </h1>
        </div>
      </section>

      <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
        <div className="w-full max-w-2xl space-y-14 lg:mx-auto 2xl:max-w-4xl 2xl:space-y-20 min-[2400px]:max-w-6xl">
          <p className="max-w-xl text-2xl leading-snug italic sm:text-3xl 2xl:max-w-3xl 2xl:text-4xl min-[2400px]:max-w-5xl min-[2400px]:text-6xl">
            One repo, many worktrees, and Claude dispatching work from the root.
          </p>

          <ol className="-mx-4 border-t">
            {links.map(({ href, title, description, enabled }, i) => {
              const text = (
                <span className="space-y-2 2xl:space-y-3">
                  <span className="block font-heading text-4xl leading-none uppercase sm:text-5xl 2xl:text-6xl min-[2400px]:text-8xl">
                    {title}
                  </span>
                  <span className="block text-lg 2xl:text-2xl min-[2400px]:text-3xl">{description}</span>
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
                      <ArrowRightIcon className="size-8 transition group-hover:translate-x-1 group-hover:text-impact-yellow group-focus-visible:text-impact-yellow 2xl:size-10 min-[2400px]:size-14" />
                    </Link>
                  ) : (
                    <div aria-disabled className={cn(row, "text-muted-foreground")}>
                      <span className={number}>0{i + 1}</span>
                      {text}
                      {/* Under the text on phones, where it would squeeze it; in the arrow's place from sm up. */}
                      <span className="col-start-2 mt-3 font-heading text-sm tracking-wide uppercase sm:col-start-3 sm:row-start-1 sm:mt-0 2xl:text-base min-[2400px]:text-xl">
                        Available after the presentation
                      </span>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </main>
  )
}
