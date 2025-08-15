import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres({
	host: "localhost",
	port: 54322,
	user: "postgres",
	password: "postgres",
	database: "todo_app",
});

export const db = drizzle(client, { schema });

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
