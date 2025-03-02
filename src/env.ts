import 'dotenv/config';
import { z } from 'zod';

export const env = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    HOST: z.string().default('localhost'),
    PORT: z.coerce.number().default(3000),

    POSTGRES_HOST: z.string(),
    POSTGRES_PORT: z.coerce.number(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),

    TEI_EMBED_API_URL: z.string().url(),
    TEI_RERANK_API_URL: z.string().url(),
  })
  .parse(process.env);
