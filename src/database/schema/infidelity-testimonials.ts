import { v4 as uuidv4 } from 'uuid';
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const infidelityTestimonialTable = sqliteTable("infidelity_testimonials", {
  id: text().primaryKey().$defaultFn(() => uuidv4()),
  status: text({ enum: ["pending", "approved", "rejected"] }).notNull(),
  author_username: text().notNull(),
  cheater_username: text().notNull(),
  story: text().notNull(),
  proof_path: text(),
  created_at: text().notNull(),
});