import { prisma } from "@/lib/prisma";
import { ikkanConfig } from "@ikkan/core";
import { z } from "zod";

export const config = ikkanConfig({
  endpoint: () => `/api/columns`,
  method: "GET",
  schema: z.object({
    id: z.string(),
  }),
  fn: async () => {
    return await prisma.column.findMany();
  },
});
