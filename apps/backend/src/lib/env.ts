import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("production"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  BETTER_AUTH_URL: z.string(), // Should be API URL
  APP_URL: z.string(), // Should be frontend URL
  HATCHET_CLIENT_TOKEN: z.string(),
  HATCHET_CLIENT_TLS_STRATEGY: z.string().optional(),
  HATCHET_CLIENT_API_URL: z.string().optional(),
  HATCHET_CLIENT_HOST_PORT: z.string().optional(),
  REDIS_URL: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);

export const isDev = env.NODE_ENV === "development";
