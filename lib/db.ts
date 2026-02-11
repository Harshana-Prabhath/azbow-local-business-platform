import { PrismaClient } from "@prisma/client/scripts/default-index.js";

const globalForPrisma = global as unknown as {
    user: any; prisma: PrismaClient 
};

export const db = globalForPrisma

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;