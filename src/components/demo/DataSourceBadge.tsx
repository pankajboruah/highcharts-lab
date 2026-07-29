import { Badge } from '@/components/ui/badge'
import type { FetchSource } from '@/lib/apiClient'

export function DataSourceBadge({
  source,
  isLoading,
}: {
  source: FetchSource
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <Badge variant="outline" className="text-muted-foreground text-xs font-normal">
        Loading…
      </Badge>
    )
  }

  if (source === 'live') {
    return (
      <Badge className="border-transparent bg-[#0ca30c]/15 text-xs font-normal text-[#0ca30c] dark:text-[#0ca30c]">
        Live data
      </Badge>
    )
  }

  return (
    <Badge className="border-transparent bg-[#fab219]/15 text-xs font-normal text-[#a86a00] dark:text-[#fab219]">
      Offline / cached data
    </Badge>
  )
}
