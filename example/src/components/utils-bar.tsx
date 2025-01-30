import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

export function UtilsBar() {
  return (
    <div className="flex items-center gap-2 p-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input className="pl-8" placeholder="Search items" />
      </div>
      <Button variant="default" className="gap-2">
        <Plus className="h-4 w-4" />
        New Item
      </Button>
      <Button variant="outline" size="icon">
        <SlidersHorizontal className="h-4 w-4" />
      </Button>
      <Button variant="outline" className="gap-2">
        Board
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </Button>
    </div>
  );
}
