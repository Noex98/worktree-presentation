import Link from "next/link"
import { ArrowLeftIcon } from "@phosphor-icons/react/ssr"
import { ImpactLogo } from "@/components/impact-logo"
import { Button } from "@/components/ui/button"

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-3xl px-6 pt-6 pb-14">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="-ml-2" nativeButton={false} render={<Link href="/" />}>
            <ArrowLeftIcon data-icon="inline-start" />
            Back
          </Button>
          <ImpactLogo className="w-20" />
        </div>
        <div className="mt-14 space-y-5">
          <h1 className="font-heading text-6xl leading-[0.9] uppercase sm:text-7xl">{title}</h1>
          {description && <p className="max-w-2xl text-2xl leading-snug italic">{description}</p>}
        </div>
      </div>
    </header>
  )
}
