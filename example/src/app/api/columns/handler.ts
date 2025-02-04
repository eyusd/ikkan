import { prisma } from "@/lib/prisma";

export const handler = {
  endpoint: () => `/api/columns`,
  method: "GET" as const,
  fn: async () => {
    return await prisma.column.findMany();
  },
};
