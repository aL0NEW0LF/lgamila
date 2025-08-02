import type { SandboxedJob } from 'bullmq';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { streamer } from '@/lib/db/schema';
import { isDev } from '@/lib/env';
import { logger } from '@/lib/logger';
import { streamCheckQueue } from '@/lib/queues/stream-check';
import { JobName, type ScheduleStreamCheckJob } from '@/types/queues';

export default async function (job: SandboxedJob<ScheduleStreamCheckJob>) {
  try {
    logger
      .withMetadata({
        jobId: job.id,
      })
      .info('Scheduling stream checks');

    const streamers = await db.query.streamer.findMany({
      where: isDev ? eq(streamer.twitchUsername, 'stormix_dev') : undefined,
    });

    await Promise.all(
      streamers.map((streamer) =>
        streamCheckQueue.add(JobName.StreamCheck, {
          streamerId: streamer.id,
        })
      )
    );

    logger
      .withMetadata({
        jobId: job.id,
      })
      .info(`Scheduled ${streamers.length} stream checks`);
  } catch (error) {
    logger
      .withError(error)
      .withMetadata({
        jobId: job.id,
      })
      .error('Failed to schedule stream checks');
    throw error;
  }
}
