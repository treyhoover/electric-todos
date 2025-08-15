import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { insertTodoSchema, todosTable, updateTodoSchema } from "@/db/schema/todos";
import { generateTxId } from "@/db/utils";

export const createTodo = createServerFn({ method: "POST" })
  .validator(insertTodoSchema)
  .handler(async ({ data: todoData }) => {
    // Custom validation for "really hard todo"
    if (todoData.text === "really hard todo") {
      throw new Error(`we don't want to do really hard todos`);
    }

    const result = await db.transaction(async (tx) => {
      const txid = await generateTxId(tx);
      const [todo] = await tx.insert(todosTable).values(todoData).returning();
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

      const [todo] = await tx.update(todosTable).set(changes).where(eq(todosTable.id, id)).returning();

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

      const [deleted] = await tx.delete(todosTable).where(eq(todosTable.id, id)).returning({ id: todosTable.id });

      if (!deleted) {
        throw new Error("Todo not found");
      }

      return { success: true, txid };
    });

    return result;
  });
