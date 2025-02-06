import { prisma } from "@/lib/prisma";
import { ikkanConfig } from "@ikkan/core";
import { z } from "zod";

export const config = ikkanConfig({
  endpoint: ({ id }: { id: string }) => `/api/columns/${id}/add-task`,
  method: "POST",
  schema: z.object({
    name: z.string(),
    content: z.string(),
    date: z.string(),
  }),
  fn: async (_req, { name, content, date }, { id }) => {
    // create a new task
    const task = await prisma.task.create({
      data: {
        name,
        content,
        date,
        columnId: parseInt(id),
      },
    });
    return task.id;
  },
});
