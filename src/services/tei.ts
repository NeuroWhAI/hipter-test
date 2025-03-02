import { env } from '@/env';
import { z } from 'zod';

const embedResSchema = z.array(z.array(z.number()).min(1)).min(1);

export async function embed(text: string): Promise<number[]> {
  const res = await fetch(env.TEI_EMBED_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json);
  }

  const embedding = await embedResSchema.parseAsync(json);

  return embedding[0];
}

const rerankResSchema = z.array(
  z.object({
    index: z.number(),
    score: z.number(),
  }),
);

export async function rerank(query: string, texts: string[]): Promise<z.infer<typeof rerankResSchema>> {
  const res = await fetch(env.TEI_RERANK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, texts, raw_scores: false }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json);
  }

  return await rerankResSchema.parseAsync(json);
}
