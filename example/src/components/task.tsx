"use client";

import { Card } from "@/components/ui/card";
import { CalendarIcon, List } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export function Task() {
  const [date, setDate] = useState<Date>();

  return (
    <Card className="p-3">
      <h3 className="font-medium">Mobile Wireframes</h3>
      <div className="mt-2">
        <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
          VIVERRA DIAM
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <List className="h-3 w-3" /> 3
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className={cn(
                  "gap-1 text-xs text-gray-500 p-1 h-auto",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="h-3 w-3" />
                {date ? format(date, "PP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Avatar className="h-6 w-6">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>U1</AvatarFallback>
        </Avatar>
      </div>
    </Card>
  );
}
