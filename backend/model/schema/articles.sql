CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    title TEXT,
    author TEXT,
    content TEXT NOT NULL,
    images TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);