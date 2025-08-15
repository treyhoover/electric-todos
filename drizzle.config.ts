import type { Config } from "drizzle-kit";

export default {
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	casing: "snake_case",
	dbCredentials: {
		url: process.env.DB_URL || "postgresql://postgres:postgres@localhost:54322/todo_app",
	},
} satisfies Config;
