import Link from "next/link"
import { ImpactLogo } from "@/components/impact-logo"
import { SlideNav } from "@/components/slides/deck"
import { cn } from "@/lib/utils"

// Layouts from IMPACT's PowerPoint master template, sized in cqw (1% of the slide's width) so they scale
// with the deck's stage. On the template's 960pt-wide slides that makes the 28pt margins 3cqw, 40pt
// titles 4.2cqw, 60pt title slides 6.25cqw, and text, which tops out at 14pt, 1.45cqw.

// The logo sits in the bottom-left corner of every slide, and leads back to the front page.
function Logo() {
  return (
    <Link href="/" aria-label="Home" className="outline-none focus-visible:text-highlight">
      <ImpactLogo className="w-[5.5cqw]" />
    </Link>
  )
}

export function TitleSlide({ title, subtitle }: { title: React.ReactNode; subtitle?: React.ReactNode }) {
  return (
    <section className="dark flex size-full flex-col bg-background p-[3cqw] text-foreground">
      <div className="mt-auto space-y-[1.6cqw]">
        <h1 className="font-heading text-[6.25cqw] leading-[0.9] uppercase">{title}</h1>
        {subtitle && <p className="max-w-[48cqw] text-[2.4cqw] leading-tight italic">{subtitle}</p>}
      </div>
      <footer className="mt-[8cqw] flex items-end justify-between">
        <Logo />
        <SlideNav />
      </footer>
    </section>
  )
}

export function Slide({
  panel,
  eyebrow,
  title,
  children,
  className,
}: {
  panel?: string
  eyebrow?: string
  title?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  const header = (eyebrow || title) && (
    <header className="space-y-[1cqw]">
      {eyebrow && <p className="font-heading text-[1.25cqw] tracking-wide text-muted-foreground uppercase">{eyebrow}</p>}
      {title && <h2 className="max-w-[60cqw] font-heading text-[4.2cqw] leading-[0.95] text-balance uppercase">{title}</h2>}
    </header>
  )
  const body = <div className={cn("flex flex-1 flex-col justify-center gap-[3cqw] py-[2cqw]", className)}>{children}</div>

  // The template's agenda layout: a black panel down the left with the slide's heading.
  if (panel) {
    return (
      <section className="grid size-full grid-cols-[30cqw_1fr] bg-background text-foreground">
        <div className="dark flex flex-col justify-between bg-background p-[3cqw] text-foreground">
          <h2 className="font-heading text-[4.2cqw] leading-[0.95] uppercase">{panel}</h2>
          <Logo />
        </div>
        <div className="flex flex-col py-[3cqw] pr-[3cqw] pl-[6cqw]">
          {header}
          {body}
          <footer className="flex justify-end">
            <SlideNav />
          </footer>
        </div>
      </section>
    )
  }

  return (
    <section className="flex size-full flex-col bg-background p-[3cqw] text-foreground">
      {header}
      {body}
      <footer className="flex items-end justify-between">
        <Logo />
        <SlideNav />
      </footer>
    </section>
  )
}
