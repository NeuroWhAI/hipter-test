import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  documents: DocumentTable;
}

export interface DocumentTable {
  id: Generated<number>;
  content: string;
  embedding: string | null;
}

export type Document = Selectable<DocumentTable>;
export type NewDocument = Insertable<DocumentTable>;
export type DocumentUpdate = Updateable<DocumentTable>;
