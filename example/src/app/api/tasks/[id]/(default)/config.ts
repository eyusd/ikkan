import { prisma } from "@/lib/prisma";
import { ikkanConfig } from "@ikkan/core";

export const getConfig = ikkanConfig({
  endpoint: ({ id }: { id: string}) => `/api/tasks/${id}`,
  method: "GET",
  fn: async (_req, { id }) => {
    return await prisma.task.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }
})

export const deleteConfig = ikkanConfig({
  endpoint: ({ id }: { id: string}) => `/api/tasks/${id}`,
  method: "DELETE",
  fn: async (_req, { id }) => {
    return await prisma.task.delete({
      where: {
        id: parseInt(id),
      },
    });
  }
})