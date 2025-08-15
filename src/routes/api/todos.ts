import type { Txid } from "@tanstack/electric-db-collection";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { sql } from "../../db/postgres";
import { generateTxId } from "../../db/utils";
import { validateInsertTodo } from "../../db/validation";

export const ServerRoute = createServerFileRoute("/api/todos").methods({
	GET: async ({ request: _request }) => {
		try {
			const todos = await sql`SELECT * FROM todos`;
			return json(todos);
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

			let txid!: Txid;
			const newTodo = await sql.begin(async (tx) => {
				txid = await generateTxId(tx);

				const [result] = await tx`
          INSERT INTO todos ${tx(todoData)}
          RETURNING *
        `;
				return result;
			});

			return json({ todo: newTodo, txid }, { status: 201 });
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
