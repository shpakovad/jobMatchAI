import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Critical error: DATABASE_URL environment variable not specified!");
}

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    accelerateUrl: databaseUrl as string,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
