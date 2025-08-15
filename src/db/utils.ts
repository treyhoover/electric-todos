import type { Txid } from "@tanstack/electric-db-collection";
import type { TransactionSql } from "postgres";

export async function generateTxId(tx: TransactionSql): Promise<Txid> {
	const result = await tx`SELECT pg_current_xact_id()::xid::text as txid`;
	const txid = result[0]?.txid;

	if (txid === undefined) {
		throw new Error("Failed to get transaction ID");
	}

	return Number.parseInt(txid, 10);
}
