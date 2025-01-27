import pool from "./database.js";

export async function getArticlesDB(author, title) {
  let query = `SELECT * FROM articles`;
  const values = [];
  const conditions = [];

  if (author) {
    conditions.push(`author ILIKE '%' || $${conditions.length + 1} || '%'`);
    values.push(author);
  }

  if (title) {
    conditions.push(`title ILIKE '%' || $${conditions.length + 1} || '%'`);
    values.push(title);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  const result = await pool.query(query, values);
  return result.rows;
}

export async function createArticleDB(url, title, author, content, images) {
  const query = `INSERT INTO articles (url, title, author, content, images)
                   VALUES ($1, $2, $3, $4, $5) RETURNING id, title`;

  const result = await pool.query(query, [url, title, author, content, images]);
  return result.rows[0];
}
