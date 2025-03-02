import { sql } from 'kysely';
import { cosineDistance, toSql } from 'pgvector/kysely';
import { db } from './database';
import type { Document, DocumentUpdate, NewDocument } from './types';

export async function findAllDocuments(): Promise<Omit<Document, 'embedding'>[]> {
  return await db.selectFrom('documents').select(['id', 'content']).execute();
}

export async function findDocumentById(id: number): Promise<Omit<Document, 'embedding'> | undefined> {
  return await db.selectFrom('documents').select(['id', 'content']).where('id', '=', id).executeTakeFirst();
}

export async function createDocument(doc: NewDocument): Promise<Pick<Document, 'id'>> {
  return await db.insertInto('documents').values(doc).returning(['id']).executeTakeFirstOrThrow();
}

export async function updateDocument(id: number, doc: DocumentUpdate): Promise<Pick<Document, 'id'> | undefined> {
  return await db.updateTable('documents').set(doc).where('id', '=', id).returning(['id']).executeTakeFirst();
}

export async function deleteDocument(id: number): Promise<Omit<Document, 'embedding'> | undefined> {
  return await db.deleteFrom('documents').where('id', '=', id).returning(['id', 'content']).executeTakeFirst();
}

export async function findSimilarDocuments(
  embedding: number[],
  topK: number,
): Promise<(Omit<Document, 'embedding'> & { score: number })[]> {
  return await db
    .selectFrom('documents')
    .select(['id', 'content', sql<number>`1 - (embedding <=> ${toSql(embedding)})`.as('score')])
    .orderBy(cosineDistance('embedding', embedding))
    .limit(topK)
    .execute();
}
