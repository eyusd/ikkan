import { prisma } from "@/lib/prisma";
import { ikkanConfig } from "@ikkan/core";

export const config = ikkanConfig({
  endpoint: ({ id }: { id: string }) => `/api/columns/${id}/tasks`,
  method: "GET",
  fn: async ({segments: { id }}) => {
    // get all tasks related to the column id
    const tasks = await prisma.task.findMany({
      where: {
        columnId: parseInt(id),
      },
    });
    return tasks.map((task) => task.id);
  },
});
