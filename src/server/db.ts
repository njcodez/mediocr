import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Maintain a single Prisma instance in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ✅ Export a shorthand alias for convenience
export const db = prisma;
