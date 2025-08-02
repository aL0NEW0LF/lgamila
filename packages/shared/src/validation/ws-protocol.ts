import { z } from 'zod';
export const serverToClient = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('connected'),
    data: z.object({
      id: z.string(),
    }),
  }),
  z.object({
    type: z.literal('ping'),
    data: z.object({
      id: z.string(),
    }),
  }),
  z.object({
    type: z.literal('streamer-live'),
    data: z.object({
      id: z.string(),
      name: z.string(),
      platform: z.string().nullable(),
      viewerCount: z.number().nullable(),
      category: z.string().nullable(),
      title: z.string().nullable(),
      avatar: z.string().nullable(),
    }),
  }),
  // ... Add other message types as needed
]);

export type ServerToClient = z.infer<typeof serverToClient>;

export const clientToServer = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    type: z.literal('pong'),
    data: z.object({
      id: z.string(),
      timestamp: z.number(),
    }),
  }),
  // ... Add other message types as needed
]);

export type ClientToServer = z.infer<typeof clientToServer>;

export const serverToServer = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('streamer-live'),
    data: z.object({
      id: z.string(),
    }),
  }),
]);

export type ServerToServer = z.infer<typeof serverToServer>;
