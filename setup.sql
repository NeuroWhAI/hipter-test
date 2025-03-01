CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS documents (
  id serial PRIMARY KEY,
  content text NOT NULL,
  embedding vector(1024)
);

CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);
