import { randomUUID } from "node:crypto";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const infidelityTestimonialTable = sqliteTable(
	"infidelity_testimonials",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => randomUUID()),
		status: text("status", {
			enum: ["pending", "approved", "rejected"],
		}).notNull(),
		authorUsername: text("author_username").notNull(),
		cheaterUsername: text("cheater_username").notNull(),
		story: text().notNull(),
		proofPath: text("proof_path"),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
);
