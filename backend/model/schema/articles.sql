CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    title TEXT,
    author TEXT,
    content TEXT NOT NULL,
    images TEXT,
    date_of_publication TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);