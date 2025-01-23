import pool from "./database.js";

export async function getArticlesDB(author, title) {
  const noFilter = !author && !title;

  const query = noFilter
    ? `SELECT * FROM articles`
    : `SELECT * FROM articles WHERE 
    (author ILIKE '%' || $1 || '%')
    AND (title ILIKE '%' || $2 || '%')`;

  const result = noFilter
    ? await pool.query(query)
    : await pool.query(query, [author, title]);

  return result.rows;
}
