import { prisma } from "@/lib/prisma";
import { ikkanConfig } from "@ikkan/core";
import { z } from "zod";

export const config = ikkanConfig({
  endpoint: ({ id }: { id: string }) => `/api/tasks/${id}/content`,
  method: "POST",
  schema: z.object({
    content: z.string(),
  }),
  fn: async (_req, { content }, { id }) => {
    // update the task name
    const task = await prisma.task.update({
      where: {
        id: parseInt(id),
      },
      data: {
        content,
      },
    });
    return task;
  },
});
