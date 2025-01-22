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

### 2. Get all articles

**Endpoint**: `GET /articles/?offset=10&limit=10`
**Description**: Fetches all the articles collected by a user.

#### Query parameters:

- `offset`(integer, optional): The starting point of the list of articles. Default is 0.
- `limit`(integer, optional): The maximum number of articles to return. Default is 25.

#### Response:

**success**:

```json
[
  {
    "id": "",
    "metadata": ""
  },
  {
    "id": "",
    "metadata": ""
  },
  {
    "id": "",
    "metadata": ""
  },
  {
    "id": "",
    "metadata": ""
  }
]
```

**status**: `200 OK`

---

### 3. Get a particular article

**Endpoint**: `GET /articles/${ref_id}`
**Description**: Fetches a particular article matching the id sent by user.

#### Response:

**success**:

```json
{
  "id": "",
  "metadata": "",
  "content": ""
}
```

**status**: `200 OK`

**error**:

```json
{
  "error": "Missing article id."
}
```

**status**: `400 Bad Request`

```json
{
  "error": "Invalid article id."
}
```

**status**: `404 Not Found`
