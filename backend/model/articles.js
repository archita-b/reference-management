import pool from "./database.js";

export async function getArticlesDB(
  author,
  title,
  startDate,
  endDate,
  offset = 0,
  limit = 25
) {
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

  if (startDate) {
    conditions.push(`date_of_publication >= $${conditions.length + 1}`);
    values.push(startDate);
  }

  if (endDate) {
    conditions.push(`date_of_publication <= $${conditions.length + 1}`);
    values.push(endDate);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(limit, offset);

  const result = await pool.query(query, values);
  return result.rows;
}

export async function getArticleDB(articleId, path) {
  let query, result;

  if (!path) {
    query = `SELECT * FROM articles WHERE id  = $1`;
    result = await pool.query(query, [articleId]);
  } else {
    query = `SELECT content #> $2 AS resource 
                   FROM articles WHERE id = $1 
                   AND content #> $2 IS NOT NULL`;

    result = await pool.query(query, [articleId, path]);
  }

  return result.rows[0];
}

export async function createArticleDB(
  url,
  title,
  author,
  content,
  images,
  dateOfPublication
) {
  const query = `INSERT INTO articles 
                  (url, title, author, content, images, date_of_publication)
                  VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title`;

  const result = await pool.query(query, [
    url,
    title,
    author,
    content,
    images,
    dateOfPublication,
  ]);

  return result.rows[0];
}

export async function saveProcess(processId, status) {
  const result = await pool.query(
    `INSERT INTO processes (id, status, total_urls, processed, skipped)
                   VALUES ($1, $2, $3, $4, $5)`,
    [processId, status.status, status.total, status.processed, status.skipped]
  );
  return result.rows[0];
}

export async function updateProcess(processId, updates) {
  const result = await pool.query(
    `UPDATE processes SET 
    status = $1, total_urls = $2, processed = $3, skipped = $4 
    WHERE id = $5`,
    [
      updates.status,
      updates.total,
      updates.processed,
      updates.skipped,
      processId,
    ]
  );
  return result.rows[0];
}

export async function getProcessById(processId) {
  const result = await pool.query(`SELECT * FROM processes WHERE id = $1`, [
    processId,
  ]);
  return result.rows;
}
