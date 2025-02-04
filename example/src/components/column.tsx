import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { Task } from "./task";

type ColumnProps = {
  id: number;
  name: string;
};

export function Column({ id, name }: ColumnProps) {
  return (
    <div className="flex w-72 flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">{name}</h2>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
            3
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Task key={i} />
        ))}
      </div>
    </div>
  );
}
