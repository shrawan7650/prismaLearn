import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient(
  {
    log: ["query", "info", "warn","error"],
    // debug: true,
    // ssl: {
    //   rejectUnauthorized: false,
    // },
    //conosle.log database connect
    
  }
)


export default prisma;