import type { streamer } from './schema';

export type Streamer = typeof streamer.$inferSelect;
export type NewStreamer = typeof streamer.$inferInsert;

export enum StreamPlatform {
  Twitch = 'twitch',
  Kick = 'kick',
}
