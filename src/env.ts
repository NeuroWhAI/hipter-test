import 'dotenv/config';
import { z } from 'zod';

export const env = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
  })
  .parse(process.env);
