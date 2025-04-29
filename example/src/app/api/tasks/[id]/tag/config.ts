import { prisma } from "@/lib/prisma";
import { ikkanConfig } from "@ikkan/core";
import { z } from "zod";

export const config = ikkanConfig({
  endpoint: ({ id }: { id: string }) => `/api/tasks/${id}/tag`,
  method: "POST",
  schema: z.object({
    tag: z.string(),
  }),
  fn: async ({params: { tag }, segments: { id }}) => {
    // update the task name
    const task = await prisma.task.update({
      where: {
        id: parseInt(id),
      },
      data: {
        tag,
      },
    });
    return task;
  },
});
