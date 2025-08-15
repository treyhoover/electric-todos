import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const configTable = pgTable("config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Config schemas (omit auto-generated fields)
export const insertConfigSchema = createInsertSchema(configTable).omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export const selectConfigSchema = createSelectSchema(configTable);
export const updateConfigSchema = insertConfigSchema.partial().strict();

// Type inference
export type SelectConfig = z.infer<typeof selectConfigSchema>;
