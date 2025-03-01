import { env } from '@/env';
import { logger } from '@/logger';
import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { docApp } from './routes/doc';
import { docSearchApp } from './routes/doc-search';

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

const app = new OpenAPIHono();
app.route('/api/doc', docApp);
app.route('/api/doc-search', docSearchApp);

app.get('/api-docs', swaggerUI({ url: '/api/api-docs' }));
app.doc('/api/api-docs', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Hipter Test',
  },
});

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
