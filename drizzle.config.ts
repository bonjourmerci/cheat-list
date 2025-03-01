import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/database/migrations",
  dialect: "turso",
  schema: "./src/database/schema",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
  migrations: {
    prefix: "timestamp",
    table: "migrations",
  },
  breakpoints: true,
  strict: true,
  verbose: true,
});
