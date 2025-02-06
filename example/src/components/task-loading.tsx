import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TaskLoading() {
  return (
    <Card className="p-3 border-xs shadow-none">
      <Skeleton className="w-full h-6 rounded-sm" />
      <div className="mt-2">
        <Skeleton className="w-1/3 h-6 rounded-sm" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-sm" />
          <Skeleton className="w-12 h-4 rounded-sm" />
        </div>
        <Skeleton className="w-6 h-6 rounded-full" />
      </div>
    </Card>
  );
}
