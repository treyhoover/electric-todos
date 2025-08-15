import { getSecret } from "@env/secrets";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(getSecret("DB_URL"));

export const db = drizzle(client);

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
