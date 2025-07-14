import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('production'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),

  KICK_CLIENT_ID: z.string(),
  KICK_CLIENT_SECRET: z.string(),

  TWITCH_CLIENT_ID: z.string(),
  TWITCH_CLIENT_SECRET: z.string(),

  REDIS_URL: z.string().default('redis://localhost:6379'),

  CACHE_TTL: z.number().default(60 * 1000 * 30), // 30 minutes
});

export const env = envSchema.parse(process.env);

export const isDev = env.NODE_ENV === 'development';
