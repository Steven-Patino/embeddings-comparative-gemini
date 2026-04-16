import { pool } from '../src/config/db.js';
import { validateEnv } from '../src/config/env.js';

const schemaSql = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS embedding_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  input_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS embedding_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES embedding_requests(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(120) NOT NULL,
  dimensions INTEGER NOT NULL,
  embedding JSONB NOT NULL,
  usage_metadata JSONB,
  raw_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_embedding_results_request_id
  ON embedding_results (request_id);

CREATE INDEX IF NOT EXISTS idx_embedding_results_provider
  ON embedding_results (provider);
`;

async function initDb() {
  validateEnv(['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']);

  try {
    await pool.query(schemaSql);
    console.log('Estructura de base de datos inicializada correctamente.');
  } catch (error) {
    console.log('No fue posible inicializar la estructura sobre la base configurada. No se creo ninguna base de datos.');
    console.error(error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

initDb().catch(async (error) => {
  console.error('Error al inicializar la base de datos:', error);
  await pool.end();
  process.exit(1);
});
