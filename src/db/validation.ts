import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { config, todos } from "./schema"
import type { z } from "zod"

// Auto-generated schemas from Drizzle schema (omit auto-generated fields)
export const insertTodoSchema = createInsertSchema(todos).omit({
  id: true,
  created_at: true,
  updated_at: true,
})
export const selectTodoSchema = createSelectSchema(todos)

// Partial schema for updates
export const updateTodoSchema = insertTodoSchema.partial().strict()

// Config schemas (omit auto-generated fields)
export const insertConfigSchema = createInsertSchema(config).omit({
  id: true,
  created_at: true,
  updated_at: true,
})
export const selectConfigSchema = createSelectSchema(config)
export const updateConfigSchema = insertConfigSchema.partial().strict()

// Type inference
export type InsertTodo = z.infer<typeof insertTodoSchema>
export type SelectTodo = z.infer<typeof selectTodoSchema>
export type UpdateTodo = z.infer<typeof updateTodoSchema>

export type InsertConfig = z.infer<typeof insertConfigSchema>
export type SelectConfig = z.infer<typeof selectConfigSchema>
export type UpdateConfig = z.infer<typeof updateConfigSchema>

// Validation functions
export const validateInsertTodo = (data: unknown): InsertTodo => {
  const parsed = insertTodoSchema.parse(data)
  if (parsed.text === `really hard todo`) {
    throw new Error(`we don't want to do really hard todos`)
  }
  return parsed
}

export const validateUpdateTodo = (data: unknown): UpdateTodo => {
  return updateTodoSchema.parse(data)
}

export const validateInsertConfig = (data: unknown): InsertConfig => {
  return insertConfigSchema.parse(data)
}

export const validateUpdateConfig = (data: unknown): UpdateConfig => {
  return updateConfigSchema.parse(data)
}