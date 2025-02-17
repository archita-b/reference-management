CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    title TEXT,
    author TEXT,
    content JSONB NOT NULL,
    images TEXT,
    date_of_publication TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE TABLE processes (
    id UUID PRIMARY KEY,
    total_urls INTEGER NOT NULL DEFAULT 0, 
    processed INTEGER DEFAULT 0, 
    skipped INTEGER DEFAULT 0, 
    status TEXT CHECK (status IN ('in_progress', 'completed', 'failed')) DEFAULT 'in_progress'
);
