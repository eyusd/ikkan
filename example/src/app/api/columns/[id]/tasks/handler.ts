import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const handler = {
  endpoint: (id: number) => `/api/columns/${id}/tasks`,
  method: "GET",
  fn: async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;
    return await prisma.column.findUnique({
      where: { id: parseInt(id) },
    });
  },
} as const;
