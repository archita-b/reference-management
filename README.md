# Reference management system API

The system allows users to submit a URL, retrieve metadata and content from a Webpage, and stores them in a database.

## **Endpoints**

### 1. Submit a URL

**Endpoint**: `POST /articles`
**Description**: Accepts URL from a user, processes it to retrieve metadata and content, and stores in database.

#### Parameters:

- `url`: ""

#### Response:

**success**:

```json
{
  "id": "",
  "metadata": ""
}
```

**status**: `201 Created`

**error**:

```json
{
  "error": "Invalid URL"
}
```

**status**: `400 Bad Request`

---

### 2. Get articles

**Endpoint**: `GET /articles/?author=author 1&title=article 1&offset=10&limit=10`
**Description**: Fetches all the articles collected by a user.

#### Query parameters:

- `author`(string, optional): Author name of the article.

- `title`(string, optional): Title of the article.

- `offset`(integer, optional): The starting point of the list of articles. Default is 0.
- `limit`(integer, optional): The maximum number of articles to return. Default is 25.

#### Response:

**success**:

```json
[
  {
    "id": 1,
    "url": "https://example.com/article1",
    "title": "Article 1",
    "author": "Author 1",
    "content": "This is the content of article 1."
  }
]
```

**status**: `200 OK`
