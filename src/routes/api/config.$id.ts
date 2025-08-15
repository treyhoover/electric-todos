import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { config } from "@/db/schema";
import { generateTxId } from "@/db/utils";
import { validateUpdateConfig } from "@/db/validation";

export const ServerRoute = createServerFileRoute("/api/config/$id").methods({
  GET: async ({ params }) => {
    try {
      const { id } = params;
      const [result] = await db
        .select()
        .from(config)
        .where(eq(config.id, Number.parseInt(id, 10)));

      if (!result) {
        return json({ error: "Config not found" }, { status: 404 });
      }

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
  PUT: async ({ params, request }) => {
    try {
      const { id } = params;
      const body = await request.json();
      const configData = validateUpdateConfig(body);

      const result = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        const [updatedConfig] = await tx
          .update(config)
          .set(configData)
          .where(eq(config.id, Number.parseInt(id, 10)))
          .returning();

        if (!updatedConfig) {
          throw new Error("Config not found");
        }

        return { config: updatedConfig, txid };
      });

      return json(result);
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

      const result = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        const [deleted] = await tx
          .delete(config)
          .where(eq(config.id, Number.parseInt(id, 10)))
          .returning({ id: config.id });

        if (!deleted) {
          throw new Error("Config not found");
        }

        return { success: true, txid };
      });

      return json(result);
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
