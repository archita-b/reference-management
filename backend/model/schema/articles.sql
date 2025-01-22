CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    author TEXT,
    content TEXT NOT NULL
);