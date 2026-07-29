import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'

export function DemoSection({
  id,
  title,
  description,
  highchartsFeature,
  children,
}: {
  id: string
  title: string
  description: string
  highchartsFeature: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className="border-border scroll-mt-20 border-t py-10 first:border-t-0 first:pt-0"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-foreground text-lg font-medium">{title}</h2>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">{description}</p>
        </div>
        <Badge variant="secondary" className="shrink-0 font-mono text-xs font-normal">
          {highchartsFeature}
        </Badge>
      </div>
      {children}
    </section>
  )
}
