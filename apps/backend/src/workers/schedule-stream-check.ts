import type { SandboxedJob } from 'bullmq';
import { db } from '@/lib/db';
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

    const streamers = await db.query.streamer.findMany({});

    await Promise.all(
      streamers.map((streamer) =>
        streamCheckQueue.add(JobName.StreamCheck, {
          streamerId: streamer.id,
        })
      )
    );
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
