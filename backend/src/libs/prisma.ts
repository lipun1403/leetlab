// import { PrismaClient } from "../generated/prisma/index.js"

// const globalForPrisma = globalThis

// export const db = globalForPrisma.prisma || new PrismaClient()

// if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = db

import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.ts'

const DATABASE = process.env.DATABASE_URL

const connectionString = `${DATABASE}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }