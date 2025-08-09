import { sql } from 'drizzle-orm';
import redis from '@/lib/redis';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import type { DbHealth, HealthResponse, RedisHealth } from '@/types/health';

export class HealthService {
  private static singleton: HealthService;

  static getInstance(): HealthService {
    if (!HealthService.singleton) {
      HealthService.singleton = new HealthService();
    }
    return HealthService.singleton;
  }

  private parseRedisInfoToMap(info: string): Map<string, string> {
    const map = new Map<string, string>();
    for (const rawLine of info.split('\n')) {
      const line = rawLine.trim();
      if (line.length === 0 || line.startsWith('#')) continue;
      const sepIndex = line.indexOf(':');
      if (sepIndex === -1) continue;
      const key = line.slice(0, sepIndex).trim();
      const value = line.slice(sepIndex + 1).trim();
      if (key) map.set(key, value);
    }
    return map;
  }

  async checkRedis(): Promise<RedisHealth> {
    try {
      const pingResponse = await redis.ping();
      const isAlive = pingResponse === 'PONG';

      const memoryInfoRaw = await redis.info('memory');
      const memoryMap = this.parseRedisInfoToMap(memoryInfoRaw);

      const usedMemoryBytes = Number(memoryMap.get('used_memory') ?? 'NaN');
      const rawMaxMemory = Number(memoryMap.get('maxmemory') ?? 'NaN');
      const totalSystemMemoryBytes = Number(
        memoryMap.get('total_system_memory') ?? 'NaN'
      );
      const isUnlimited = rawMaxMemory === 0;
      const maxMemoryBytes = isUnlimited
        ? null
        : Number.isFinite(rawMaxMemory)
          ? rawMaxMemory
          : null;
      const freeMemoryBytes =
        !isUnlimited && Number.isFinite(usedMemoryBytes) && maxMemoryBytes !== null
          ? Math.max(maxMemoryBytes - usedMemoryBytes, 0)
          : null;
      const hasFreeMemory = isUnlimited ? true : (freeMemoryBytes ?? 0) > 0;

      return {
        alive: isAlive,
        hasFreeMemory,
        usedMemoryBytes: Number.isFinite(usedMemoryBytes)
          ? usedMemoryBytes
          : null,
        maxMemoryBytes,
        freeMemoryBytes,
        totalSystemMemoryBytes: Number.isFinite(totalSystemMemoryBytes)
          ? totalSystemMemoryBytes
          : null,
        maxMemoryPolicy: memoryMap.get('maxmemory_policy') ?? null,
      };
    } catch (error) {
      logger.withError(error as Error).error('Redis health check failed');
      return {
        alive: false,
        hasFreeMemory: false,
        usedMemoryBytes: null,
        maxMemoryBytes: null,
        freeMemoryBytes: null,
        totalSystemMemoryBytes: null,
        maxMemoryPolicy: null,
        error: (error as Error).message,
      };
    }
  }

  async checkDb(): Promise<DbHealth> {
    try {
      // A lightweight no-op query to validate connectivity
      await db.execute(sql`select 1`);
      return { alive: true };
    } catch (error) {
      logger.withError(error as Error).error('DB health check failed');
      return { alive: false, error: (error as Error).message };
    }
  }

  async check(): Promise<HealthResponse> {
    const [redisHealth, dbHealth] = await Promise.all([
      this.checkRedis(),
      this.checkDb(),
    ]);

    const healthy =
      redisHealth.alive && redisHealth.hasFreeMemory && dbHealth.alive;

    return {
      status: healthy ? 'ok' : 'degraded',
      redis: redisHealth,
      db: dbHealth,
    };
  }
}


