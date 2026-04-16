import { pool } from '../config/db.js';

export class EmbeddingRepository {
  async createRequestWithResults({ text, results }) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const requestInsertQuery = `
        INSERT INTO embedding_requests (input_text)
        VALUES ($1)
        RETURNING id, input_text, created_at
      `;

      const requestResult = await client.query(requestInsertQuery, [text]);
      const requestRow = requestResult.rows[0];

      const persistedResults = [];

      for (const result of results) {
        const resultInsertQuery = `
          INSERT INTO embedding_results (
            request_id,
            provider,
            model,
            dimensions,
            embedding,
            usage_metadata,
            raw_response
          )
          VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb)
          RETURNING id, provider, model, dimensions, embedding, usage_metadata, created_at
        `;

        const insertValues = [
          requestRow.id,
          result.provider,
          result.model,
          result.dimensions,
          JSON.stringify(result.embedding),
          JSON.stringify(result.usage),
          JSON.stringify(result.rawResponse),
        ];

        const resultInsert = await client.query(resultInsertQuery, insertValues);
        persistedResults.push(resultInsert.rows[0]);
      }

      await client.query('COMMIT');

      return {
        request: requestRow,
        results: persistedResults,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findRequestById(requestId) {
    const requestQuery = `
      SELECT id, input_text, created_at
      FROM embedding_requests
      WHERE id = $1
    `;

    const resultsQuery = `
      SELECT id, request_id, provider, model, dimensions, embedding, usage_metadata, created_at
      FROM embedding_results
      WHERE request_id = $1
      ORDER BY provider ASC
    `;

    const [requestResult, resultsResult] = await Promise.all([
      pool.query(requestQuery, [requestId]),
      pool.query(resultsQuery, [requestId]),
    ]);

    return {
      request: requestResult.rows[0] || null,
      results: resultsResult.rows,
    };
  }

  async listRequests(limit = 20) {
    const query = `
      SELECT id, input_text, created_at
      FROM embedding_requests
      ORDER BY created_at DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}
