import { cn } from "@/lib/utils"

export function Slide({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: string
  title?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("mx-auto flex w-full max-w-5xl flex-col gap-12 px-10", className)}>
      {(eyebrow || title) && (
        <header className="space-y-4">
          {eyebrow && <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">{eyebrow}</p>}
          {title && (
            <h2 className="font-heading text-5xl font-semibold tracking-tight text-balance lg:text-6xl">{title}</h2>
          )}
        </header>
      )}
      {children}
    </section>
  )
}
