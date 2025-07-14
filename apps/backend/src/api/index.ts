import { Hono } from 'hono';
import cache from '@/lib/cache/default';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import type { ApiContext } from '../types/api';

const api = new Hono<ApiContext>().get('/streamers', async (c) => {
  const cachedStreamers = await cache.get<string>('streamers');

  if (cachedStreamers) {
    logger.info('Returning cached streamers');
    return c.json({
      streamers: JSON.parse(cachedStreamers),
    });
  }

  const streamers = await db.query.streamer.findMany({
    columns: {
      id: true,
      name: true,
      avatarUrl: true,
      twitchUsername: true,
      kickUsername: true,
      isLive: true,
      livePlatform: true,
      viewerCount: true,
      category: true,
      title: true,
    },
  });

  await cache.set('streamers', JSON.stringify(streamers));

  return c.json({
    streamers,
  });
});

export default api;
