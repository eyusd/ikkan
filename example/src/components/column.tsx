"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { Task } from "./task";
import { useGetTasks } from "@/app/api/columns/[id]/tasks/bridge";
import { TaskLoading } from "./task-loading";

type ColumnProps = {
  id: string;
  name: string;
};

export function Column({ id, name }: ColumnProps) {
  const { data: tasks } = useGetTasks({ id })();

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
        {tasks == undefined
          ? Array.from({ length: Math.floor(1 + Math.random() * 3) }).map(
              (_, i) => <TaskLoading key={i} />,
            )
          : tasks.map((id) => <Task key={id} id={id.toString()} />)}
      </div>
    </div>
  );
}
