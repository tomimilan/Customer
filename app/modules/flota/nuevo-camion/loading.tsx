import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-9 w-32" />
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex gap-4 pt-6">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
