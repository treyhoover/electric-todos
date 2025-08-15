import { getSecret } from "@env/secrets";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: getSecret("DB_URL"),
  },
} satisfies Config;
