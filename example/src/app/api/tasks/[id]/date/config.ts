import { prisma } from "@/lib/prisma";
import { ikkanConfig } from "@ikkan/core";
import { z } from "zod";

export const config = ikkanConfig({
  endpoint: ({ id }: { id: string }) => `/api/tasks/${id}/date`,
  method: "POST",
  schema: z.object({
    date: z.string(),
  }),
  fn: async ({params: { date }, segments: { id } }) => {
    // update the task name
    const task = await prisma.task.update({
      where: {
        id: parseInt(id),
      },
      data: {
        date,
      },
    });
    return task;
  },
});
