/**
 * Decorator needs to be a function to maintain the 'this' context.
 */

import { AxiosError } from 'axios';
import { RateLimitRetriesExceededError } from '@/lib/errors/generic';
import { logger } from '@/lib/logger';

interface RateLimitOptions {
  maxRetries?: number;
  defaultDelayMs?: number;
}

/**
 * Method decorator to handle rate limits (HTTP 429) for class methods.
 * Supports both Retry-After and token-based rate limiting (X-RateLimit-* headers).
 */
export const rateLimit =
  <This, Args extends unknown[], Return>(options: RateLimitOptions = {}) =>
  (
    _: unknown,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<
      (this: This, ...args: Args) => Promise<Return>
    >
  ): TypedPropertyDescriptor<
    (this: This, ...args: Args) => Promise<Return>
  > => {
    const originalMethod = descriptor.value;
    if (!originalMethod) {
      throw new Error(`Method ${propertyKey} not found on target`);
    }

    descriptor.value = function (this: This, ...args: Args): Promise<Return> {
      // Bind the original method to maintain 'this' context
      const boundMethod = originalMethod.bind(this);
      // Apply rate limiting wrapper
      return wrapWithRateLimitHandling<Args, Return>(
        boundMethod,
        options
      )(...args);
    };

    return descriptor;
  };

/**
 * Function wrapper to handle rate limits (HTTP 429) for async functions using axios.
 * Supports both Retry-After and token-based rate limiting (X-RateLimit-* headers).
 *
 * @param fn - The async function to wrap (should return a Promise)
 * @param options - Optional settings: maxRetries, defaultDelayMs
 */

export function wrapWithRateLimitHandling<Args extends unknown[], Return>(
  fn: (...args: Args) => Promise<Return>,
  options: RateLimitOptions = {}
): (...args: Args) => Promise<Return> {
  const maxRetries = options.maxRetries ?? 2;
  const defaultDelayMs = options.defaultDelayMs ?? 1000;

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: skill issue
  return async (...args: Args): Promise<Return> => {
    let attempt = 0;
    while (true) {
      try {
        // biome-ignore lint/nursery/noAwaitInLoop: decorator usage is fine.
        return await fn(...args);
      } catch (error) {
        const isRateLimited =
          error instanceof AxiosError && error.response?.status === 429;
        if (isRateLimited && attempt < maxRetries) {
          attempt++;
          const headers = error.response?.headers;
          const retryAfter = headers?.['retry-after'];
          const rateLimitReset = headers?.['x-ratelimit-reset'];
          const rateLimitLimit = headers?.['x-ratelimit-limit'];
          const rateLimitRemaining = headers?.['x-ratelimit-remaining'];

          // Prefer X-RateLimit-Reset, then Retry-After, then default
          let delayMs = defaultDelayMs;
          if (rateLimitReset) {
            const resetSeconds = Number(rateLimitReset);
            if (!Number.isNaN(resetSeconds)) {
              delayMs = resetSeconds * 1000;
            }
          } else if (retryAfter) {
            const retryAfterSeconds = Number(retryAfter);
            if (!Number.isNaN(retryAfterSeconds)) {
              delayMs = retryAfterSeconds * 1000;
            }
          }

          logger
            .withError(error)
            .withMetadata({
              attempt,
              delayMs,
              url: error.config?.url,
              rateLimitLimit,
              rateLimitRemaining,
              rateLimitReset,
              retryAfter,
            })
            .warn('Rate limited (HTTP 429). Retrying after delay.');
          await new Promise((res) => setTimeout(res, delayMs));
          continue;
        }

        if (isRateLimited) {
          throw new RateLimitRetriesExceededError(
            `Rate limit retries exceeded after ${maxRetries} attempts`,
            error as Error
          );
        }

        // Propagate original error
        throw error;
      }
    }
  };
}
