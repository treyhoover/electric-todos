import "dotenv/config";
import { z } from "zod";

const secretsSchema = z.object({
  DB_URL: z.url().default("postgresql://postgres:postgres@localhost:54322/todo_app"),
  ELECTRIC_SECRET: z.string().min(1),
});

export const getSecret = (key: keyof typeof secretsSchema.shape) => {
  if (typeof window !== "undefined") {
    throw new Error("🚨 Secrets are not available in the browser!");
  }

  return secretsSchema.shape[key].parse(process.env[key]);
};
