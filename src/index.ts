import { env } from '@/env';
import { logger } from '@/logger';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';

logger.info(`Starting up in ${env.NODE_ENV} mode`);

const onCloseSignal = () => {
  logger.info('sigint received, shutting down');

  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('Forcing shutdown');
    process.exit(1);
  }, 10000).unref();

  // Do some cleanup here
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);

const app = new Hono();
app.get('/', (c) => c.text('Hello Node.js!'));

const server = serve(
  {
    fetch: app.fetch,
    hostname: env.HOST,
    port: env.PORT,
  },
  (info) => {
    logger.info(`Server listening on ${env.HOST}:${info.port}`);
  },
);
