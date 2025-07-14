import { type Cache, createCache } from 'cache-manager';
import { err, ok } from 'neverthrow';
import { z } from 'zod';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { NotFoundError } from '../errors/generic';
import { HttpClient } from '../http';
import { rateLimit } from '../ratelimit';

export class KickService extends HttpClient {
  static #instance: KickService;
  static baseUrl = 'https://api.kick.com/public/v1';

  tokenCache: Cache;

  private constructor() {
    super(
      KickService.baseUrl,
      logger.child().withContext({ service: KickService.name })
    );
    this.tokenCache = createCache({
      ttl: 1000 * 60 * 60 * 24,
    });
  }

  static get instance() {
    if (!KickService.#instance) {
      KickService.#instance = new KickService();
    }
    return KickService.#instance;
  }

  async getToken() {
    const cachedToken = await this.tokenCache.get<{
      access_token: string;
      token_type: string;
      expires_at: Date;
    }>('kick_token');

    if (cachedToken && cachedToken.expires_at > new Date()) {
      return ok(cachedToken);
    }

    const response = await this.request({
      method: 'POST',
      endpoint: 'https://id.kick.com/oauth/token',
      config: {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
      data: {
        grant_type: 'client_credentials',
        client_id: env.KICK_CLIENT_ID,
        client_secret: env.KICK_CLIENT_SECRET,
      },
      responseSchema: z.object({
        access_token: z.string(),
        token_type: z.string(),
        expires_in: z.number(),
      }),
    });

    if (response.isErr()) {
      return err(response.error);
    }

    await this.tokenCache.set<{
      access_token: string;
      token_type: string;
      expires_at: Date;
    }>('kick_token', {
      access_token: response.value.access_token,
      token_type: response.value.token_type,
      expires_at: new Date(Date.now() + response.value.expires_in * 1000),
    });

    return ok(response.value);
  }

  async getStreamer(slug: string) {
    const token = await this.getToken();

    if (token.isErr()) {
      return err(token.error);
    }

    this.logger
      .withMetadata({
        channel: slug,
      })
      .info('Looking up streamer');

    const response = await this.request({
      method: 'GET',
      endpoint: `/channels?slug=${slug}`,
      config: {
        headers: {
          Authorization: `Bearer ${token.value.access_token}`,
        },
      },
      responseSchema: z.object({
        data: z.array(
          z.object({
            banner_picture: z.string(),
            broadcaster_user_id: z.number(),
            category: z.object({
              id: z.number(),
              name: z.string(),
              thumbnail: z.string(),
            }),
            channel_description: z.string(),
            slug: z.string(),
            stream: z.object({
              is_live: z.boolean(),
              is_mature: z.boolean(),
              key: z.string(),
              language: z.string(),
              start_time: z.string(),
              thumbnail: z.string(),
              url: z.string(),
              viewer_count: z.number(),
            }),
            stream_title: z.string(),
          })
        ),
        message: z.string(),
      }),
    });

    if (response.isErr()) {
      return err(response.error);
    }

    if (response.value.data.length === 0) {
      return err(new NotFoundError('Streamer not found'));
    }

    return ok(response.value.data[0]);
  }

  @rateLimit({
    maxRetries: 3,
    defaultDelayMs: 1000,
  })
  async isStreamerLive(channel: string) {
    const user = await this.getStreamer(channel);

    if (user.isErr() || !user.value) {
      return err(new NotFoundError('User not found'));
    }

    const stream = (
      await this.getStream(user.value.broadcaster_user_id.toString())
    ).unwrapOr(null);

    return ok({
      isLive: user.value?.stream?.is_live,
      stream: user.value?.stream?.is_live
        ? {
            id: user.value.stream.key,
            title: stream?.stream_title ?? '',
            game: stream?.category?.name ?? '',
            viewerCount: user.value.stream.viewer_count,
          }
        : null,
    });
  }

  @rateLimit({
    maxRetries: 3,
    defaultDelayMs: 1000,
  })
  async getStream(channelId: string) {
    const token = await this.getToken();

    if (token.isErr()) {
      return err(token.error);
    }

    const response = await this.request({
      method: 'GET',
      endpoint: `/livestreams?broadcaster_user_id=${channelId}`,
      config: {
        headers: {
          Authorization: `Bearer ${token.value.access_token}`,
        },
      },
      responseSchema: z.object({
        data: z.array(
          z.object({
            broadcaster_user_id: z.number(),
            category: z.object({
              id: z.number(),
              name: z.string(),
              thumbnail: z.string(),
            }),
            channel_id: z.number(),
            has_mature_content: z.boolean(),
            language: z.string(),
            slug: z.string(),
            started_at: z.string(),
            stream_title: z.string(),
            thumbnail: z.string(),
            viewer_count: z.number(),
          })
        ),
        message: z.string(),
      }),
    });

    if (response.isErr()) {
      return err(response.error);
    }

    if (response.value.data.length === 0) {
      return err(new NotFoundError('Stream not found'));
    }

    return ok(response.value.data[0]);
  }
}
