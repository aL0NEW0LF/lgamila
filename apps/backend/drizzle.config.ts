import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env" });

// eslint-disable-next-line turbo/no-undeclared-env-vars -- this is ok
const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
