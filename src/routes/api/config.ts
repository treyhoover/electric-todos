import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { db } from "@/db/drizzle";
import { config } from "@/db/schema";
import { generateTxId } from "@/db/utils";
import { validateInsertConfig } from "@/db/validation";

export const ServerRoute = createServerFileRoute("/api/config").methods({
  GET: async ({ request: _request }) => {
    try {
      const result = await db.select().from(config);
      return json(result);
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
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      console.log("POST /api/config", body);
      const configData = validateInsertConfig(body);

      const result = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);
        const [newConfig] = await tx.insert(config).values(configData).returning();
        if (!newConfig) {
          throw new Error("Failed to create config");
        }
        return { config: newConfig, txid };
      });

      return json(result, { status: 201 });
    } catch (error) {
      console.error("Error creating config:", error);
      return json(
        {
          error: "Failed to create config",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      );
    }
  },
});
