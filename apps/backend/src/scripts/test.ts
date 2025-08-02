import { and, eq, isNull } from 'drizzle-orm';
import batch from 'it-batch';
import { db } from '@/lib/db';
import { streamer as streamerTable } from '@/lib/db/schema';
import { logger } from '@/lib/logger';
import { KickService } from '@/lib/services/kick';
import { TwitchService } from '@/lib/services/twitch';

export default async function main() {
  const streamers = await db.query.streamer.findMany({
    where: and(isNull(streamerTable.avatarUrl)),
  });

  const streamersBatches = batch(streamers, 100);

  for await (const batch of streamersBatches) {
    for (const streamer of batch) {
      let streamerAvatarUrl: string | null = null;
      if (streamer.twitchUsername) {
        // biome-ignore lint/nursery/noAwaitInLoop: dnc
        const streamerTwitch = await TwitchService.instance.getStreamer(
          streamer.twitchUsername
        );
        streamerAvatarUrl =
          streamerTwitch.unwrapOr(null)?.profilePictureUrl ?? null;
      } else if (streamer.kickUsername) {
        const streamerKick = await KickService.instance.getStreamer(
          streamer.kickUsername
        );
        streamerAvatarUrl = streamerKick.unwrapOr(null)?.banner_picture ?? null;
      } else {
        continue;
      }

      await db
        .update(streamerTable)
        .set({
          avatarUrl: streamerAvatarUrl,
        })
        .where(eq(streamerTable.id, streamer.id));

      logger.info(
        `Updated streamer ${streamer.name} with avatar ${streamerAvatarUrl}`
      );
    }
  }
}
