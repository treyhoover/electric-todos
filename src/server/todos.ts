import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { todos } from "@/db/schema";
import { generateTxId } from "@/db/utils";
import { insertTodoSchema, updateTodoSchema } from "@/db/validation";

export const createTodo = createServerFn({ method: "POST" })
  .validator(insertTodoSchema)
  .handler(async ({ data: todoData }) => {
    // Custom validation for "really hard todo"
    if (todoData.text === "really hard todo") {
      throw new Error(`we don't want to do really hard todos`);
    }

    const result = await db.transaction(async (tx) => {
      const txid = await generateTxId(tx);
      const [todo] = await tx.insert(todos).values(todoData).returning();
      if (!todo) {
        throw new Error("Failed to create todo");
      }
      return { todo, txid };
    });
    return result;
  });

export const updateTodo = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.number(),
      changes: updateTodoSchema,
    }),
  )
  .handler(async ({ data: { id, changes } }) => {
    const result = await db.transaction(async (tx) => {
      const txid = await generateTxId(tx);

      const [todo] = await tx.update(todos).set(changes).where(eq(todos.id, id)).returning();

      if (!todo) {
        throw new Error("Todo not found");
      }

      return { todo, txid };
    });

    return result;
  });

export const deleteTodo = createServerFn({ method: "POST" })
  .validator(z.number())
  .handler(async ({ data: id }) => {
    const result = await db.transaction(async (tx) => {
      const txid = await generateTxId(tx);

      const [deleted] = await tx.delete(todos).where(eq(todos.id, id)).returning({ id: todos.id });

      if (!deleted) {
        throw new Error("Todo not found");
      }

      return { success: true, txid };
    });

    return result;
  });
