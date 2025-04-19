import { findSimilarDocuments } from '@/db/document-repo';
import { embed, rerank } from '@/services/tei';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { memCache } from 'hono-mem-cache';

const app = new OpenAPIHono();

app.use(
  memCache({
    max: 10,
    ttl: 5000,
    key: (c) => `${c.req.method}:${c.req.url}`,
  }),
);

app.openapi(
  createRoute({
    tags: ['Document'],
    method: 'post',
    path: '/similar',
    summary: 'Search for similar documents',
    request: {
      query: z.object({
        content: z.string().openapi({ param: { required: true } }),
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
      400: {
        content: {
          'application/json': {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
        description: 'Bad request',
      },
    },
  }),
  async (c) => {
    const content = c.req.query('content');
    if (!content) {
      return c.json({ error: 'Query is required' }, 400);
    }

    const embedding = await embed(content);
    const docs = await findSimilarDocuments(embedding, 3);

    return c.json(docs, 200);
  },
);

app.openapi(
  createRoute({
    tags: ['Document'],
    method: 'post',
    path: '/qna',
    summary: 'Search for answering questions',
    request: {
      query: z.object({
        question: z.string().openapi({ param: { required: true } }),
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
      400: {
        content: {
          'application/json': {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
        description: 'Bad request',
      },
    },
  }),
  async (c) => {
    const question = c.req.query('question');
    if (!question) {
      return c.json({ error: 'Query is required' }, 400);
    }

    const embedding = await embed(question);
    const docs = await findSimilarDocuments(embedding, 5);

    const rerankRes = await rerank(
      question,
      docs.map((d) => d.content),
    );

    return c.json(
      rerankRes
        .slice(0, 3)
        .map((r) => ({ doc: docs[r.index], score: r.score }))
        .map(({ doc, score }) => ({ id: doc.id, content: doc.content, score })),
      200,
    );
  },
);

export { app as docSearchApp };
