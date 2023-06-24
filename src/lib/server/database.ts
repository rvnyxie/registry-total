// Here is the interface to interact with database
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient()

export default db