import { Pool } from 'pg';
import { env } from './env.js';

export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  ssl: env.db.ssl ? { rejectUnauthorized: false } : false,
});

pool.on('error', (error) => {
  console.error('Error inesperado en el pool de PostgreSQL:', error);
});

export async function testDbConnection() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    console.log('Conexion a PostgreSQL verificada correctamente.');
  } finally {
    client.release();
  }
}
