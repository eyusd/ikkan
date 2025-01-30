import { Header } from "@/components/header";
import { UtilsBar } from "@/components/utils-bar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Column } from "@/components/column";

const COLUMNS = ["To do", "In progress", "Review", "Done"];

export default function Home() {
  return (
    <div className="container mx-auto h-full flex flex-col rounded-xl border shadow-lg">
      <Header />
      <UtilsBar />
      <ScrollArea className="mx-2 flex-1">
        <div className="whitespace-nowrap flex flex-1 gap-4 p-4">
          {COLUMNS.map((column) => (
            <Column key={column} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
