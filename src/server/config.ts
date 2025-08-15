import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { config } from "@/db/schema";
import { generateTxId } from "@/db/utils";
import { insertConfigSchema, updateConfigSchema } from "@/db/validation";

export const createConfig = createServerFn({ method: "POST" })
  .validator(insertConfigSchema)
  .handler(async ({ data: configData }) => {
    const result = await db.transaction(async (tx) => {
      const txid = await generateTxId(tx);
      const [newConfig] = await tx.insert(config).values(configData).returning();
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

      const [updatedConfig] = await tx.update(config).set(changes).where(eq(config.id, id)).returning();

      if (!updatedConfig) {
        throw new Error("Config not found");
      }

      return { config: updatedConfig, txid };
    });

    return result;
  });
