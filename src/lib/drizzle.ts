import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../drizzle/schema";

const dbSingleton = () => {
  const client = postgres(process.env.DATABASE_URL!);
  return drizzle(client, { schema });
};

declare global {
  var db: undefined | ReturnType<typeof dbSingleton>;
}

const db = globalThis.db ?? dbSingleton();

export { db };

if (process.env.NODE_ENV !== "production") globalThis.db = db;
