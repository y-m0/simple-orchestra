import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800',
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export function WorkflowNodeSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-2">
      <Skeleton className="h-6 w-[120px]" />
      <Skeleton className="h-4 w-[80px]" />
      <Skeleton className="h-4 w-[100px]" />
    </div>
  )
}
