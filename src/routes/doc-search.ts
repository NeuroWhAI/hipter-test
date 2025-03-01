import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { zValidator } from '@hono/zod-validator';

const app = new OpenAPIHono();

app.openapi(
  createRoute({
    tags: ['Document'],
    method: 'post',
    path: '/semantic',
    summary: 'Search for documents',
    request: {
      query: z.object({
        q: z.string().openapi({ param: { required: true } }),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(
              z.object({
                id: z.number(),
                content: z.string(),
                score: z.number(),
              }),
            ),
          },
        },
        description: 'Search for documents',
      },
    },
  }),
  (c) => {
    const query = c.req.query('q');
    return c.json([]);
  },
);

export { app as docSearchApp };
