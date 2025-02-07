import { prisma } from "@/lib/prisma";
import { ikkanConfig } from "@ikkan/core";

export const config = ikkanConfig({
  endpoint: () => `/api/columns`,
  method: "GET",
  fn: async () => {
    return await prisma.column.findMany();
  },
});
