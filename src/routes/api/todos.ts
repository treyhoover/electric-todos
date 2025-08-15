import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { db } from "@/db/drizzle";
import { todos } from "@/db/schema";
import { generateTxId } from "@/db/utils";
import { validateInsertTodo } from "@/db/validation";

export const ServerRoute = createServerFileRoute("/api/todos").methods({
  GET: async ({ request: _request }) => {
    try {
      const result = await db.select().from(todos);
      return json(result);
    } catch (error) {
      console.error("Error fetching todos:", error);
      return json(
        {
          error: "Failed to fetch todos",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      );
    }
  },
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const todoData = validateInsertTodo(body);

      const result = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        const [todo] = await tx.insert(todos).values(todoData).returning();
        if (!todo) {
          throw new Error("Failed to create todo");
        }
        return { todo, txid };
      });

      return json(result, { status: 201 });
    } catch (error) {
      console.error("Error creating todo:", error);
      return json(
        {
          error: "Failed to create todo",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      );
    }
  },
});
