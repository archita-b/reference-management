# Reference management system API

The system allows users to submit a URL, retrieve metadata and content from a Webpage, and stores them in a database.

## **Endpoints**

### 1. Submit a URL

**Endpoint**: `POST /articles`
**Description**: Accepts URL from a user, processes it to retrieve metadata and content, and stores in database.

#### Parameters:

- `url`: "https://en.wikipedia.org/wiki/Octopus"

#### Response:

**success**:

**status**: `201 Created`

```json
{
  "id": "",
  "metadata": ""
}
```

**error**:

**status**: `400 Bad Request`

```json
{
  "error": "URL is required."
}
```

---

### 2. Get articles

**Endpoint**: `GET /articles/?author=author 1&title=article 1&offset=10&limit=10&startDate=2020-12-19T07:44:26Z&endDate=2024-10-01T07:44:26Z`
**Description**: Fetches all the articles collected by a user matching the query parameters.

#### Query parameters:

- `author`(string, optional): Name of the author of the article.

- `title`(string, optional): Title of the article.

- `startDate`(string, optional): Filter to retrieve articles published on or after this date. Format is '2020-12-19T07:44:26Z'.

- `endDate`(string, optional): Filter to retrieve articles published on or before this date. Format is '2024-10-01T05:37:58Z'.

- `offset`(integer, optional): The starting point of the list of articles. Default is 0.
- `limit`(integer, optional): The maximum number of articles to return. Default is 25.

#### Response:

**success**:

**status**: `200 OK`

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
