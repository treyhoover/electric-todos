import type { Txid } from "@tanstack/electric-db-collection";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { sql } from "../../db/postgres";
import { generateTxId } from "../../db/utils";
import { validateUpdateConfig } from "../../db/validation";

export const ServerRoute = createServerFileRoute("/api/config/$id").methods({
	GET: async ({ params }) => {
		try {
			const { id } = params;
			const [config] = await sql`SELECT * FROM config WHERE id = ${id}`;

			if (!config) {
				return json({ error: "Config not found" }, { status: 404 });
			}

			return json(config);
		} catch (error) {
			console.error("Error fetching config:", error);
			return json(
				{
					error: "Failed to fetch config",
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
			const configData = validateUpdateConfig(body);

			let txid!: Txid;
			const updatedConfig = await sql.begin(async (tx) => {
				txid = await generateTxId(tx);

				const [result] = await tx`
          UPDATE config
          SET ${tx(configData)}
          WHERE id = ${id}
          RETURNING *
        `;

				if (!result) {
					throw new Error("Config not found");
				}

				return result;
			});

			return json({ config: updatedConfig, txid });
		} catch (error) {
			if (error instanceof Error && error.message === "Config not found") {
				return json({ error: "Config not found" }, { status: 404 });
			}

			console.error("Error updating config:", error);
			return json(
				{
					error: "Failed to update config",
					details: error instanceof Error ? error.message : String(error),
				},
				{ status: 500 },
			);
		}
	},
	DELETE: async ({ params }) => {
		try {
			const { id } = params;

			let txid!: Txid;
			await sql.begin(async (tx) => {
				txid = await generateTxId(tx);

				const [result] = await tx`
          DELETE FROM config
          WHERE id = ${id}
          RETURNING id
        `;

				if (!result) {
					throw new Error("Config not found");
				}
			});

			return json({ success: true, txid });
		} catch (error) {
			if (error instanceof Error && error.message === "Config not found") {
				return json({ error: "Config not found" }, { status: 404 });
			}

			console.error("Error deleting config:", error);
			return json(
				{
					error: "Failed to delete config",
					details: error instanceof Error ? error.message : String(error),
				},
				{ status: 500 },
			);
		}
	},
});
