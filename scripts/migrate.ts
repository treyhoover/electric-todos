import { getSecret } from "@env/secrets";
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
	connectionString: getSecret("DB_URL"),
});

const db = drizzle(pool);

async function main() {
	console.log("Running migrations...");
	await migrate(db, { migrationsFolder: "./drizzle" });
	console.log("Migrations completed!");
	await pool.end();
}

main().catch((err) => {
	console.error("Migration failed!", err);
	process.exit(1);
});
