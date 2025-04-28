import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// This is to prevent the Prisma Client from being instantiated multiple times
// in development mode, which can cause issues with hot reloading.
// In production, a new Prisma Client instance will be created for each request.
