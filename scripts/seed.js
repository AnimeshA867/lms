const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();
async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Mathematics" },
        { name: "Physics" },
        { name: "Biology" },
        { name: "Chemistry" },
        { name: "History" },
        { name: "Literature" },
        { name: "Art" },
        { name: "Music" },
        { name: "Business" },
        { name: "Economics" },
        { name: "Psychology" },
        { name: "Philosophy" },
        { name: "Engineering" },
        { name: "Languages" },
      ],
    });
    console.log("Database categories seeded successfully.");
  } catch (error) {
    console.log("Error seeding the database categories.", error);
  } finally {
    await database.$disconnect();
  }
}

main();
