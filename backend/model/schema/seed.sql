INSERT INTO articles (url, title, author, content) VALUES
        ('https://example.com/article1', 'Article 1', 'Author 1', 
        'This is the content of article 1.'),
        ('https://example.com/article2', 'Article 2', 'Author 2', 
        'This is the content of article 2.'),
        ('https://example.com/article3', 'Article 3', 'Author 1', 
        'This is the content of article 3.');

-- Inserting 1M records in articles table
DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..5000000 LOOP
        INSERT INTO articles (
            url,
            title,
            author,
            content,
            images,
            date_of_publication,
            created_at
        )
        VALUES (
            'https://example.com/article_' || i, 
            gen_random_uuid()::text, 
            gen_random_uuid()::text, 
            'This is mock content for article number ' || i, 
            'https://example.com/image_' || i || '.jpg', 
            NOW() - (i % 365 || ' days')::INTERVAL, 
            NOW() 
        );
    END LOOP;
END $$;



INSERT INTO articles (
    url,
    title,
    author,
    content,
    images,
    date_of_publication,
    created_at
)
VALUES (
    'https://en.wikipedia.org/wiki/Octopus', 
    'Octopus', 
    NULL, 
    '[{"Octopus": { "physiology": { "tentacles": "some data"}} }]'::jsonb, 
    NULL, 
    NOW(), 
    NOW()
);
