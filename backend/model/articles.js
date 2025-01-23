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

export async function createArticleDB(url, title, author, content, images) {
  const query = `INSERT INTO articles (url, title, author, content, images)
                   VALUES ($1, $2, $3, $4, $5) RETURNING id, title`;

  const result = await pool.query(query, [url, title, author, content, images]);
  return result.rows[0];
}
