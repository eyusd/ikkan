import { prisma } from "@/lib/prisma";
import { ikkanConfig } from "@ikkan/core";
import { z } from "zod";

export const config = ikkanConfig({
  endpoint: ({ id }: { id: string }) => `/api/tasks/${id}/name`,
  method: "POST",
  schema: z.object({
    name: z.string(),
  }),
  fn: async ({params: { name }, segments: { id }}) => {
    // update the task name
    const task = await prisma.task.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });
    return task;
  },
});
