import { createKeyv as createKeyvRedis } from '@keyv/redis';
import { createCache } from 'cache-manager';
import { env } from '../env';

const redisStore = createKeyvRedis(env.REDIS_URL);

const cache = createCache({
  stores: [redisStore],
  ttl: env.CACHE_TTL,
});

export default cache;
