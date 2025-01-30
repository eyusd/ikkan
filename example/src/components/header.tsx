import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function Header() {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">Example board</h1>
        <span className="rounded bg-blue-600 px-2 py-1 text-xs text-white">
          Ikkan
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Avatar key={i} className="border-2 border-white">
              <AvatarImage src={`https://avatar.vercel.sh/${i}.svg`} />
              <AvatarFallback>U{i + 1}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <Button variant="outline" size="sm" className="ml-2">
          <Plus className="mr-1 h-4 w-4" />
          New Member
        </Button>
      </div>
    </div>
  );
}
