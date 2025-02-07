import { PrismaClient } from "@prisma/client";
import { add } from "date-fns";

const prisma = new PrismaClient();

let seeded = false;

export async function seedDatabase() {
  if (seeded) return;

  try {
    // Check if we already have data
    const columnsCount = await prisma.column.count();

    if (columnsCount > 0) {
      console.log("Database already seeded");
      seeded = true;
      return;
    }

    console.log("Seeding database...");

    // Create sample columns
    const todoColumn = await prisma.column.create({
      data: {
        name: "To Do",
      },
    });

    const inProgressColumn = await prisma.column.create({
      data: {
        name: "In Progress",
      },
    });

    const reviewColumn = await prisma.column.create({
      data: {
        name: "Review",
      },
    });

    const doneColumn = await prisma.column.create({
      data: {
        name: "Done",
      },
    });

    // Create sample tasks
    await prisma.task.createMany({
      data: [
        {
          name: "Set up project",
          content:
            "Initialize Next.js project with Prisma and configure database",
          date: new Date().toISOString(),
          tag: "nextjs",
          columnId: todoColumn.id,
        },
        {
          name: "Design database schema",
          content: "Create initial database schema for the application",
          date: add(new Date(), { days: 1 }).toISOString(),
          tag: "prisma",
          columnId: todoColumn.id,
        },
        {
          name: "Implement authentication",
          content: "Add user authentication using Next.js middleware",
          date: add(new Date(), { days: 2 }).toISOString(),
          tag: "nextjs",
          columnId: inProgressColumn.id,
        },
        {
          name: "Write documentation",
          content: "Document the API and database schema",
          date: add(new Date(), { days: -1 }).toISOString(),
          tag: "docs",
          columnId: doneColumn.id,
        },
      ],
    });

    console.log("Database seeded!");
    seeded = true;
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}
