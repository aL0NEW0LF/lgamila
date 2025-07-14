import { eq } from 'drizzle-orm';
import { Cacheable, CacheClear } from '../cache';
import { db } from '../db';
import { config } from '../db/schema';
import { logger } from '../logger';

export class ConfigService {
  private static singleton: ConfigService;

  static getInstance(): ConfigService {
    if (!ConfigService.singleton) {
      ConfigService.singleton = new ConfigService();
    }
    return ConfigService.singleton;
  }

  @Cacheable({
    ttlSeconds: 15 * 60, // 15 minutes
  })
  async get<T = string>(key: string): Promise<T | null> {
    const result = await db.query.config.findFirst({
      where: eq(config.key, key),
    });

    if (!result) {
      return null;
    }

    try {
      return JSON.parse(result.value) as T;
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (_e) {
      // If not a JSON value, return as is
      return result.value as unknown as T;
    }
  }

  async getString(key: string): Promise<string | null> {
    return this.get<string>(key);
  }

  async getNumber(key: string): Promise<number | null> {
    const value = await this.get<string | number>(key);
    if (value === null) return null;
    if (typeof value === 'number') return value;

    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  async getBoolean(key: string): Promise<boolean | null> {
    const value = await this.get<string | boolean>(key);
    if (value === null) return null;
    if (typeof value === 'boolean') return value;

    return value.toLowerCase() === 'true';
  }

  @CacheClear({
    cacheKey: (args) => args[0],
  })
  async set<T>(key: string, value: T): Promise<void> {
    const now = new Date();
    const stringValue =
      typeof value === 'string' ? value : JSON.stringify(value);

    try {
      await db
        .insert(config)
        .values({
          key,
          value: stringValue,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: config.key,
          set: {
            value: stringValue,
            updatedAt: now,
          },
        });
    } catch (error) {
      logger.withError(error).error('Failed to set config value');
      throw error;
    }
  }

  @CacheClear({
    cacheKey: (args) => args[0],
  })
  async delete(key: string): Promise<void> {
    await db.delete(config).where(eq(config.key, key));
  }
}
