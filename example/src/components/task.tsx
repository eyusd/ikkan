"use client";

import { Card } from "@/components/ui/card";
import { CalendarIcon, List } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { deleteTask, useGetTask } from "@/app/api/tasks/[id]/(default)/bridge";
import { TaskLoading } from "./task-loading";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { taskName } from "@/app/api/tasks/[id]/name/bridge";
import { taskContent } from "@/app/api/tasks/[id]/content/bridge";
import { taskTag } from "@/app/api/tasks/[id]/tag/bridge";
import { taskDate } from "@/app/api/tasks/[id]/date/bridge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { InputBlur } from "./input-blur";
import { TextareaBlur } from "./textarea-blur";


type TaskProps = {
  id: string;
};

export function Task({ id }: TaskProps) {
  const [open, setOpen] = useState(false);
  const { data, error } = useGetTask({ id })();
  const { post: postTaskName } = taskName({ id });
  const { post: postTaskContent } = taskContent({ id });
  const { post: postTaskTag } = taskTag({ id });
  const { post: postTaskDate } = taskDate({ id });
  const { delete: del } = deleteTask({ id });

  if (error || data === null) {
    return <div>Error</div>;
  }
  
  if (data === undefined) {
    return (
      <TaskLoading />
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>

        <Card className="p-3 hover:bg-accent" onClick={() => setOpen(true)}>
          <h3 className="font-medium truncate">
            { data.name }
          </h3>
          <div className="mt-2">
            <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
              { data.tag }
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <List className="h-3 w-3" /> 
                { data.content.split("\n").length }
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <CalendarIcon className="h-3 w-3" />
                {format(data.date, "PP")}
              </span>
            </div>
            <Avatar className="h-6 w-6">
              <AvatarImage src={`https://avatar.vercel.sh/${id}.svg`} />
              <AvatarFallback>{id}</AvatarFallback>
            </Avatar>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
        </DialogHeader>
        <InputBlur
          defaultValue={data.name}
          onBlur={(name) => postTaskName({ name })}
        />
        <TextareaBlur
          defaultValue={data.content}
          onBlur={(content) => postTaskContent({ content })}
        />
        <InputBlur
          defaultValue={data.tag}
          onBlur={(tag) => postTaskTag({ tag })}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="justify-start text-left font-normal w-1/2 text-muted-foreground"
            >
              <CalendarIcon />
              {format(parseISO(data.date), "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={parseISO(data.date)}
              onSelect={(date) => postTaskDate({ date: date?.toISOString() ?? "" })}
            />
          </PopoverContent>
        </Popover>
        <DialogFooter>
          <Button 
            variant="destructive"
            onClick={async () => {
              await del();
              setOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
