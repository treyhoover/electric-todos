import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const todosTable = pgTable("todos", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  completed: boolean("completed").notNull().default(false),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Auto-generated schemas from Drizzle schema (omit auto-generated fields)
export const insertTodoSchema = createInsertSchema(todosTable).omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export const selectTodoSchema = createSelectSchema(todosTable);

// Partial schema for updates
export const updateTodoSchema = insertTodoSchema.partial().strict();

// Type inference
export type SelectTodo = z.infer<typeof selectTodoSchema>;
