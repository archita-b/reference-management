# Reference management system API

The system allows users to submit a URL, retrieve metadata and content from a Webpage, and stores them in a database.

## **Endpoints**

### 1. Submit a URL

**Endpoint**: `POST /references`
**Description**: Accepts URL from a user, processes it to retrieve metadata and content, and stores in database.

#### Parameters:

- `url`: ""

#### Response:

**success**:

```json
{
  "ref_id": "",
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

### 2. Get all references

**Endpoint**: `GET /references/?offset=10&limit=10`
**Description**: Fetches all the references collected by a user.

#### Query parameters:

- `offset`(integer, optional): The starting point of the list of references. Default is 0.
- `limit`(integer, optional): The maximum number of references to return. Default is 25.

#### Response:

**success**:

```json
[
  {
    "ref_id": "",
    "metadata": ""
  },
  {
    "ref_id": "",
    "metadata": ""
  },
  {
    "ref_id": "",
    "metadata": ""
  },
  {
    "ref_id": "",
    "metadata": ""
  }
]
```

**status**: `200 OK`

### Get a reference

**Endpoint**: `GET /references/${ref_id}`
**Description**: Fetches a particular reference matching the id sent by user.

#### Response:

**success**:

```json
{
  "ref_id": "",
  "metadata": "",
  "content": ""
}
```

**status**: `200 OK`

**error**:

```json
{
  "error": "Missing reference id."
}
```

**status**: `400 Bad Request`

```json
{
  "error": "Invalid reference id."
}
```

**status**: `404 Not Found`
