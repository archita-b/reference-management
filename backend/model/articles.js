import pool from "./database.js";

export async function getArticlesDB(author) {
  const query = `SELECT * FROM articles WHERE author ILIKE $1`;
  const result = await pool.query(query, [author]);
  return result.rows;
}
