import { z } from "zod";

const appEnvSchema = z.enum(["development", "production"]).default("development");

const envSchema = z.object({
  VITE_APP_ENV: appEnvSchema,
  VITE_ELECTRIC_URL: z.url(),
  VITE_APP_URL: z.url(),
  VITE_ELECTRIC_SOURCE_ID: z.string().min(1),
});

type AppEnv = z.infer<typeof appEnvSchema>;
type EnvSchema = z.infer<typeof envSchema>;

const envDefaults: Record<AppEnv, EnvSchema> = {
  development: {
    VITE_APP_ENV: "development",
    VITE_ELECTRIC_URL: "https://api.electric-sql.cloud/v1/shape",
    VITE_APP_URL: "http://localhost:5173",
    VITE_ELECTRIC_SOURCE_ID: "ce4fd2c3-6391-4504-bbf1-3f08b74cc571",
  },
  production: {
    VITE_APP_ENV: "production",
    VITE_ELECTRIC_URL: "https://api.electric-sql.cloud/v1/shape",
    VITE_APP_URL: "https://example.com",
    VITE_ELECTRIC_SOURCE_ID: "ce4fd2c3-6391-4504-bbf1-3f08b74cc571",
  },
};

const appEnv = appEnvSchema.parse(import.meta.env.VITE_APP_ENV);

export const vars = envSchema.parse({
  ...envDefaults[appEnv],
  ...import.meta.env,
});
