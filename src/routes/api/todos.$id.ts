import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { todos } from "@/db/schema";
import { generateTxId } from "@/db/utils";
import { validateUpdateTodo } from "@/db/validation";

export const ServerRoute = createServerFileRoute("/api/todos/$id").methods({
	GET: async ({ params }) => {
		try {
			const { id } = params;
			const [todo] = await db
				.select()
				.from(todos)
				.where(eq(todos.id, Number.parseInt(id, 10)));

			if (!todo) {
				return json({ error: "Todo not found" }, { status: 404 });
			}

			return json(todo);
		} catch (error) {
			console.error("Error fetching todo:", error);
			return json(
				{
					error: "Failed to fetch todo",
					details: error instanceof Error ? error.message : String(error),
				},
				{ status: 500 },
			);
		}
	},
	PUT: async ({ params, request }) => {
		try {
			const { id } = params;
			const body = await request.json();
			const todoData = validateUpdateTodo(body);

			const result = await db.transaction(async (tx) => {
				const txid = await generateTxId(tx);

				const [todo] = await tx
					.update(todos)
					.set(todoData)
					.where(eq(todos.id, Number.parseInt(id, 10)))
					.returning();

				if (!todo) {
					throw new Error("Todo not found");
				}

				return { todo, txid };
			});

			return json(result);
		} catch (error) {
			if (error instanceof Error && error.message === "Todo not found") {
				return json({ error: "Todo not found" }, { status: 404 });
			}

			console.error("Error updating todo:", error);
			return json(
				{
					error: "Failed to update todo",
					details: error instanceof Error ? error.message : String(error),
				},
				{ status: 500 },
			);
		}
	},
	DELETE: async ({ params }) => {
		try {
			const { id } = params;

			const result = await db.transaction(async (tx) => {
				const txid = await generateTxId(tx);

				const [deleted] = await tx
					.delete(todos)
					.where(eq(todos.id, Number.parseInt(id, 10)))
					.returning({ id: todos.id });

				if (!deleted) {
					throw new Error("Todo not found");
				}

				return { success: true, txid };
			});

			return json(result);
		} catch (error) {
			if (error instanceof Error && error.message === "Todo not found") {
				return json({ error: "Todo not found" }, { status: 404 });
			}

			console.error("Error deleting todo:", error);
			return json(
				{
					error: "Failed to delete todo",
					details: error instanceof Error ? error.message : String(error),
				},
				{ status: 500 },
			);
		}
	},
});
