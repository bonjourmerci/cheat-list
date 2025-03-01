import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

export const infidelityTestimonialTable = sqliteTable(
	"infidelity_testimonials",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => uuidv4()),
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
