import { IkkanHandlerParams } from "@ikkan/core";
import { prisma } from "@/lib/prisma";

export const handler = {
  method: "GET",
  fn: async () => {
    const columns = await prisma.column.findMany();
    return columns.map((column) => column.id);
  },
} as const;
