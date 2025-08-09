import { serverToServer } from '@lgamila/shared';
import { eq } from 'drizzle-orm';
import { Topics } from '@/types/pub-sub';
import { db } from './db';
import { streamer } from './db/schema';
import { logger } from './logger';
import { pubSub } from './redis';
import { WebSocketManager } from './websocket';

pubSub.on('message', async (channel, message) => {
  logger.info(`Received message on channel ${channel}`);

  if (!message) {
    logger.warn('No message provided, skipping');
    return;
  }

  const parsed = serverToServer.safeParse(JSON.parse(message));
  if (!parsed.success) {
    logger
      .withMetadata({
        channel,
        message,
      })
      .withError(parsed.error)
      .warn('Invalid message');
    return;
  }

  switch (parsed.data.type) {
    case Topics.STREAMER_LIVE: {
      const streamerDB = await db.query.streamer.findFirst({
        where: eq(streamer.id, parsed.data.data.id),
      });

      if (!streamerDB) {
        logger.warn('Streamer not found');
        return;
      }

      WebSocketManager.instance.broadcastMessage({
        type: 'streamer-live',
        data: {
          id: parsed.data.data.id,
          name: streamerDB.name,
          platform: streamerDB.livePlatform,
          platforms: streamerDB.livePlatforms,
          viewerCount: streamerDB.viewerCount,
          category: streamerDB.category,
          title: streamerDB.title,
          avatar: streamerDB.avatarUrl ?? null,
        },
      });
      break;
    }
    default:
      logger.warn(`Unknown message type: ${parsed.data.type}`);
      return;
  }
});

await pubSub.subscribe(Topics.STREAMER_LIVE, (error) => {
  if (error) {
    logger.withError(error).error('Error subscribing to streamer live');
    return;
  }
});
