import dotenv from 'dotenv';

dotenv.config();

export function validateEnv(requiredEnvVars) {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno requeridas: ${missing.join(', ')}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  embeddingDimensions: Number(process.env.EMBEDDING_DIMENSIONS || 1536),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  primaryEmbeddingModel: process.env.PRIMARY_EMBEDDING_MODEL || 'gemini-embedding-001',
  secondaryEmbeddingModel: process.env.SECONDARY_EMBEDDING_MODEL || 'gemini-embedding-2-preview',
  db: {
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true',
  },
};
