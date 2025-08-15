import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { configTable, insertConfigSchema, updateConfigSchema } from "@/db/schema/config";
import { generateTxId } from "@/db/utils";

export const createConfig = createServerFn({ method: "POST" })
  .validator(insertConfigSchema)
  .handler(async ({ data: configData }) => {
    const result = await db.transaction(async (tx) => {
      const txid = await generateTxId(tx);
      const [newConfig] = await tx.insert(configTable).values(configData).returning();
      if (!newConfig) {
        throw new Error("Failed to create config");
      }
      return { config: newConfig, txid };
    });
    return result;
  });

export const updateConfig = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.number(),
      changes: updateConfigSchema,
    }),
  )
  .handler(async ({ data: { id, changes } }) => {
    const result = await db.transaction(async (tx) => {
      const txid = await generateTxId(tx);

      const [updatedConfig] = await tx.update(configTable).set(changes).where(eq(configTable.id, id)).returning();

      if (!updatedConfig) {
        throw new Error("Config not found");
      }

      return { config: updatedConfig, txid };
    });

    return result;
  });
