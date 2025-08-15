import type { Txid } from "@tanstack/electric-db-collection";
import { sql } from "drizzle-orm";
import { z } from "zod";
import type { Tx } from "@/db/drizzle";

const txidSchema = z
  .string()
  .min(1)
  .transform((val) => Number.parseInt(val, 10));

export async function generateTxId(tx: Tx): Promise<Txid> {
  const [res] = await tx.execute(sql`SELECT pg_current_xact_id()::xid::text as txid`);

  return txidSchema.parse(res?.txid);
}
