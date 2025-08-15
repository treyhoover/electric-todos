import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { config, todos } from "./schema";

// Auto-generated schemas from Drizzle schema (omit auto-generated fields)
export const insertTodoSchema = createInsertSchema(todos).omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export const selectTodoSchema = createSelectSchema(todos);

// Partial schema for updates
export const updateTodoSchema = insertTodoSchema.partial().strict();

// Config schemas (omit auto-generated fields)
export const insertConfigSchema = createInsertSchema(config).omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export const selectConfigSchema = createSelectSchema(config);
export const updateConfigSchema = insertConfigSchema.partial().strict();

// Type inference
export type SelectTodo = z.infer<typeof selectTodoSchema>;
export type SelectConfig = z.infer<typeof selectConfigSchema>;
