import { serverToServer } from '@lgamila/shared';
import type { SandboxedJob } from 'bullmq';
import { eq } from 'drizzle-orm';
import cache from '@/lib/cache/default';
import { db } from '@/lib/db';
import { streamer } from '@/lib/db/schema';
import type { Streamer } from '@/lib/db/types';
import { isDev } from '@/lib/env';
import { logger } from '@/lib/logger';
import { pubSub } from '@/lib/redis';
import { KickService } from '@/lib/services/kick';
import { TwitchService } from '@/lib/services/twitch';
import { Topics } from '@/types/pub-sub';
import type { StreamCheckJob } from '@/types/queues';
import { StreamPlatform } from '@/types/server';

interface StreamStatus {
  isLive: boolean;
  platform: StreamPlatform | null;
  platforms: StreamPlatform[] | null;
  viewerCount: number;
  category: string | null;
  title: string | null;
}

export default async function (job: SandboxedJob<StreamCheckJob>) {
  try {
    const streamerId = job.data.streamerId;
    
    if (!streamerId) {
      logger
        .withMetadata({
          jobId: job.id,
          jobData: job.data,
        })
        .error('StreamerId is null or undefined');
      return;
    }
    
    const streamerDB = await db.query.streamer.findFirst({
      where: eq(streamer.id, streamerId),
    });

    if (!streamerDB) {
      logger
        .withMetadata({
          jobId: job.id,
        })
        .error('Streamer not found');
      return;
    }

    if (isDev) {
      pubSub.publish(
        Topics.STREAMER_LIVE,
        JSON.stringify(
          serverToServer.parse({
            type: 'streamer-live',
            data: {
              id: streamerId,
            },
          })
        )
      );
    }
    logger
      .withMetadata({
        jobId: job.id,
      })
      .info(`Checking if ${streamerDB.name} is live`);

    // Check both platforms and determine overall status
    const streamStatus = await checkStreamStatus(streamerDB, job.id);

    // Only update if status has changed
    const hasStatusChanged = hasStreamStatusChanged(streamerDB, streamStatus);

    if (hasStatusChanged) {
      // Clear the streamers cache
      logger.info('Clearing streamers cache');
      await cache.del('streamers');

      // If streamer went live, broadcast the streamer status to the websocket
      if (streamerDB.isLive === false && streamStatus.isLive) {
        pubSub.publish(
          Topics.STREAMER_LIVE,
          JSON.stringify(
            serverToServer.parse({
              type: 'streamer-live',
              data: {
                id: streamerId,
              },
            })
          )
        );
        logger.info(
          `Published streamer live event to ${Topics.STREAMER_LIVE} for streamer ${streamerDB.name}`
        );
      }

      // Update the streamer status
      await updateStreamerStatus(streamerId, streamStatus);

      logger
        .withMetadata({
          jobId: job.id,
        })
        .info(
          `Updated ${streamerDB.name} live status: ${streamStatus.isLive} on ${streamStatus.platforms?.join(', ')}`
        );
    }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: we need it for zod error!
    console.log(error);
    logger
      .withError(error)
      .withMetadata({
        jobId: job.id,
      })
      .error('Failed to check if streamer is live');
    throw error;
  }
}

function hasStreamStatusChanged(
  streamerDB: Streamer,
  streamStatus: StreamStatus
): boolean {
  return (
    streamStatus.isLive !== (streamerDB.isLive ?? false) ||
    streamStatus.platform !== streamerDB.livePlatform ||
    streamStatus.platforms !== streamerDB.livePlatforms ||
    streamStatus.category !== streamerDB.category ||
    streamStatus.viewerCount !== streamerDB.viewerCount ||
    streamStatus.title !== streamerDB.title
  );
}

async function updateStreamerStatus(
  streamerId: string,
  streamStatus: StreamStatus
): Promise<void> {
  await db
    .update(streamer)
    .set({
      isLive: streamStatus.isLive,
      livePlatform: streamStatus.platform,
      livePlatforms: streamStatus.platforms,
      viewerCount: streamStatus.viewerCount,
      category: streamStatus.category,
      title: streamStatus.title,
    })
    .where(eq(streamer.id, streamerId));
}

async function checkStreamStatus(
  streamerDB: Streamer,
  jobId: string | undefined
): Promise<StreamStatus> {
  const twitchStatus = await checkTwitchStatus(streamerDB, jobId);
  const kickStatus = await checkKickStatus(streamerDB, jobId);

  if (twitchStatus?.isLive && !kickStatus?.isLive) {
    return twitchStatus;
  }

  if (kickStatus?.isLive && !twitchStatus?.isLive) {
    return kickStatus;
  }

  if (twitchStatus?.isLive && kickStatus?.isLive) {
    return {
      ...twitchStatus,
      platforms: [StreamPlatform.Twitch, StreamPlatform.Kick],
    };
  }

  // If not live on any platform, return offline status
  return {
    isLive: false,
    platform: null,
    platforms: null,
    viewerCount: 0,
    category: null,
    title: null,
  };
}

async function checkTwitchStatus(
  streamerDB: Streamer,
  jobId: string | undefined
): Promise<StreamStatus | null> {
  if (!streamerDB.twitchUsername) {
    return null;
  }

  const result = await TwitchService.instance.isStreamerLive(
    streamerDB.twitchUsername
  );

  if (result.isErr()) {
    logger
      .withError(result.error)
      .withMetadata({ jobId })
      .error('Failed to check if streamer is live on Twitch');
    return null;
  }

  const { isLive, stream } = result.value;
  return {
    isLive,
    platform: isLive ? StreamPlatform.Twitch : null,
    platforms: isLive ? [StreamPlatform.Twitch] : null,
    viewerCount: stream?.viewerCount ?? 0,
    category: stream?.game ?? null,
    title: stream?.title ?? null,
  };
}

async function checkKickStatus(
  streamerDB: Streamer,
  jobId: string | undefined
): Promise<StreamStatus | null> {
  if (!streamerDB.kickUsername) {
    return null;
  }

  const result = await KickService.instance.isStreamerLive(
    streamerDB.kickUsername
  );

  if (result.isErr()) {
    logger
      .withError(result.error)
      .withMetadata({ jobId })
      .error('Failed to check if streamer is live on Kick');
    return null;
  }

  const { isLive, stream } = result.value;
  return {
    isLive: isLive ?? false,
    platform: isLive ? StreamPlatform.Kick : null,
    platforms: isLive ? [StreamPlatform.Kick] : null,
    viewerCount: stream?.viewerCount ?? 0,
    category: stream?.game ?? null,
    title: stream?.title ?? null,
  };
}
