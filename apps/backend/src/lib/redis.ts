import IORedis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const pubSub = redis.duplicate();

redis.on('error', (error) => {
  logger.withError(error).error('Redis error');
  process.exit(1);
});

redis.on('connect', () => {
  logger
    .withMetadata({
      service: 'redis',
    })
    .info('Redis connected');
});

pubSub.on('error', (error) => {
  logger.withError(error).error('Redis error');
  process.exit(1);
});

pubSub.on('connect', () => {
  logger.info('Redis pubsub connected');
});

export default redis;
export { pubSub };
