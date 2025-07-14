import { createAppLogger, createLoggerContext } from '@moroccan-stream/logging';
import type { NodeClient } from '@sentry/node';
import * as Sentry from '@sentry/node';
import { env } from './env';

export const loggerContext = createLoggerContext();
const sentryClient = Sentry.getClient<NodeClient>();

export const logger = createAppLogger({
  app: 'moroccan-stream',
  environment: env.NODE_ENV,
  version: '0.0.1',
  context: loggerContext,
  options: {
    sentryClient,
  },
});
