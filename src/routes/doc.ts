import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

const app = new OpenAPIHono();

app.openapi(
  createRoute({
    tags: ['Document'],
    method: 'get',
    path: '/',
    summary: 'Get all documents',
    request: {},
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(
              z.object({
                id: z.number(),
                content: z.string(),
              }),
            ),
          },
        },
        description: 'Get all documents',
      },
    },
  }),
  (c) => {
    return c.json([]);
  },
);

app.openapi(
  createRoute({
    tags: ['Document'],
    method: 'post',
    path: '/',
    summary: 'Create a new document',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              content: z.string(),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: z.object({
              id: z.number(),
            }),
          },
        },
        description: 'Create a new document',
      },
    },
  }),
  (c) => {
    const newDoc = c.req.valid('json');
    return c.json({ id: 0 });
  },
);

app.openapi(
  createRoute({
    tags: ['Document'],
    method: 'get',
    path: '/:id',
    summary: 'Get a document by ID',
    request: {
      params: z.object({
        id: z.coerce.number().openapi({
          param: {
            required: true,
          },
        }),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({
              id: z.number(),
              content: z.string(),
            }),
          },
        },
        description: 'Get a document by ID',
      },
    },
  }),
  (c) => {
    const id = c.req.param('id');
    return c.json({
      id: Number.parseInt(id),
      content: 'Hello Node.js!',
    });
  },
);

app.openapi(
  createRoute({
    tags: ['Document'],
    method: 'put',
    path: '/:id',
    summary: 'Update a document by ID',
    request: {
      params: z.object({
        id: z.coerce.number().openapi({
          param: {
            required: true,
          },
        }),
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              content: z.string(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({
              id: z.number(),
            }),
          },
        },
        description: 'Update a document by ID',
      },
    },
  }),
  (c) => {
    const id = c.req.param('id');
    const updatedDoc = c.req.valid('json');
    return c.json({ id: Number.parseInt(id) });
  },
);

app.openapi(
  createRoute({
    tags: ['Document'],
    method: 'delete',
    path: '/:id',
    summary: 'Delete a document by ID',
    request: {
      params: z.object({
        id: z.coerce.number().openapi({
          param: {
            required: true,
          },
        }),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({
              id: z.number(),
            }),
          },
        },
        description: 'Delete a document by ID',
      },
    },
  }),
  (c) => {
    const id = c.req.param('id');
    return c.json({ id: Number.parseInt(id) });
  },
);

export { app as docApp };
