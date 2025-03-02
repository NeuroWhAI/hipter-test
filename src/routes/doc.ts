import { createDocument, deleteDocument, findAllDocuments, findDocumentById, updateDocument } from '@/db/document-repo';
import { embed } from '@/services/tei';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import pgvector from 'pgvector/kysely';

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
  async (c) => {
    const docs = await findAllDocuments();
    return c.json(docs);
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
  async (c) => {
    const newDoc = c.req.valid('json');

    const embedding = await embed(newDoc.content);
    const res = await createDocument({
      embedding: pgvector.toSql(embedding),
      ...newDoc,
    });

    return c.json(res);
  },
);

app.openapi(
  createRoute({
    tags: ['Document'],
    method: 'get',
    path: '/{id}',
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
      404: {
        content: {
          'application/json': {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
        description: 'Document not found',
      },
    },
  }),
  async (c) => {
    const id = Number.parseInt(c.req.param('id'));
    const doc = await findDocumentById(id);
    if (doc) {
      return c.json(doc, 200);
    } else {
      return c.json({ error: 'Document not found' }, 404);
    }
  },
);

app.openapi(
  createRoute({
    tags: ['Document'],
    method: 'put',
    path: '/{id}',
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
      404: {
        content: {
          'application/json': {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
        description: 'Document not found',
      },
    },
  }),
  async (c) => {
    const id = Number.parseInt(c.req.param('id'));
    const doc = c.req.valid('json');

    const embedding = await embed(doc.content);
    const res = await updateDocument(id, {
      embedding: pgvector.toSql(embedding),
      ...doc,
    });

    if (res) {
      return c.json(res, 200);
    } else {
      return c.json({ error: 'Document not found' }, 404);
    }
  },
);

app.openapi(
  createRoute({
    tags: ['Document'],
    method: 'delete',
    path: '/{id}',
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
              content: z.string(),
            }),
          },
        },
        description: 'Delete a document by ID',
      },
      404: {
        content: {
          'application/json': {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
        description: 'Document not found',
      },
    },
  }),
  async (c) => {
    const id = Number.parseInt(c.req.param('id'));
    const doc = await deleteDocument(id);
    if (doc) {
      return c.json(doc, 200);
    } else {
      return c.json({ error: 'Document not found' }, 404);
    }
  },
);

export { app as docApp };
