export interface RedisHealth {
  alive: boolean;
  hasFreeMemory: boolean;
  usedMemoryBytes: number | null;
  maxMemoryBytes: number | null; // null when unlimited
  freeMemoryBytes: number | null; // null when unlimited
  totalSystemMemoryBytes: number | null;
  maxMemoryPolicy: string | null;
  error?: string;
}

export interface DbHealth {
  alive: boolean;
  error?: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  redis: RedisHealth;
  db: DbHealth;
}


