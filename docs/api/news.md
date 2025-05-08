# News Articles API

## Get News Articles

Returns a paginated list of news articles.

**URL**: `/news`

**Method**: `GET`

**Auth required**: Yes

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Number of results per page (default: 20)
- `sort` (string, optional): Field to sort by (default: "publishedAt")
- `order` (string, optional): Sort order ("asc" or "desc", default: "desc")
- `search` (string, optional): Search term for article title or content
- `companyId` (string, optional): Filter by company ID
- `category` (string, optional): Filter by category (e.g., "clinical-trials", "regulatory")
- `sentiment` (string, optional): Filter by sentiment ("positive", "negative", "neutral")
- `startDate` (string, optional): Filter by start date (ISO format)
- `endDate` (string, optional): Filter by end date (ISO format)

**Response**:

\`\`\`json
{
  "data": [
    {
      "id": "news_123456789",
      "title": "Pfizer Announces Positive Phase 3 Results for New Cancer Drug",
      "summary": "Pfizer Inc. announced today positive results from its Phase 3 clinical trial...",
      "content": "Pfizer Inc. (NYSE: PFE) announced today positive results from its Phase 3 clinical trial for its new cancer drug, showing a 40% reduction in disease progression...",
      "source": "BusinessWire",
      "author": "John Smith",
      "publishedAt": "2023-05-01T10:30:00Z",
      "url": "https://www.businesswire.com/news/pfizer-phase3-results",
      "imageUrl": "https://example.com/images/pfizer-trial.jpg",
      "category": "clinical-trials",
      "companies": [
        {
          "id": "comp_123456789",
          "name": "Pfizer Inc.",
          "ticker": "PFE"
        }
      ],
      "sentiment": {
        "positive": 0.78,
        "negative": 0.05,
        "neutral": 0.17,
        "compound": 0.73
      },
      "tags": ["cancer", "clinical trial", "phase 3", "oncology"]
    },
    // More articles...
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "limit": 20,
    "pages": 63
  }
}
\`\`\`

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Invalid token

## Get News Article by ID

Returns detailed information about a specific news article.

**URL**: `/news/:id`

**Method**: `GET`

**Auth required**: Yes

**URL Parameters**:
- `id` (string, required): News article ID

**Response**:

\`\`\`json
{
  "id": "news_123456789",
  "title": "Pfizer Announces Positive Phase 3 Results for New Cancer Drug",
  "summary": "Pfizer Inc. announced today positive results from its Phase 3 clinical trial...",
  "content": "Pfizer Inc. (NYSE: PFE) announced today positive results from its Phase 3 clinical trial for its new cancer drug, showing a 40% reduction in disease progression...",
  "source": "BusinessWire",
  "author": "John Smith",
  "publishedAt": "2023-05-01T10:30:00Z",
  "url": "https://www.businesswire.com/news/pfizer-phase3-results",
  "imageUrl": "https://example.com/images/pfizer-trial.jpg",
  "category": "clinical-trials",
  "companies": [
    {
      "id": "comp_123456789",
      "name": "Pfizer Inc.",
      "ticker": "PFE"
    }
  ],
  "sentiment": {
    "positive": 0.78,
    "negative": 0.05,
    "neutral": 0.17,
    "compound": 0.73
  },
  "tags": ["cancer", "clinical trial", "phase 3", "oncology"],
  "relatedArticles": [
    {
      "id": "news_987654321",
      "title": "Pfizer's Cancer Drug Shows Promise in Earlier Studies",
      "publishedAt": "2023-02-15T14:45:00Z"
    }
    // More related articles...
  ]
}
\`\`\`

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Invalid token
- `404 Not Found`: News article not found

## Get News by Company

Returns news articles related to a specific company.

**URL**: `/news/companies/:companyId`

**Method**: `GET`

**Auth required**: Yes

**URL Parameters**:
- `companyId` (string, required): Company ID

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Number of results per page (default: 20)
- `sort` (string, optional): Field to sort by (default: "publishedAt")
- `order` (string, optional): Sort order ("asc" or "desc", default: "desc")
- `category` (string, optional): Filter by category
- `sentiment` (string, optional): Filter by sentiment
- `startDate` (string, optional): Filter by start date
- `endDate` (string, optional): Filter by end date

**Response**:

\`\`\`json
{
  "data": [
    {
      "id": "news_123456789",
      "title": "Pfizer Announces Positive Phase 3 Results for New Cancer Drug",
      "summary": "Pfizer Inc. announced today positive results from its Phase 3 clinical trial...",
      "source": "BusinessWire",
      "publishedAt": "2023-05-01T10:30:00Z",
      "category": "clinical-trials",
      "sentiment": {
        "positive": 0.78,
        "negative": 0.05,
        "neutral": 0.17,
        "compound": 0.73
      },
      "tags": ["cancer", "clinical trial", "phase 3", "oncology"]
    },
    // More articles...
  ],
  "pagination": {
    "total": 350,
    "page": 1,
    "limit": 20,
    "pages": 18
  },
  "sentimentSummary": {
    "positive": 0.65,
    "negative": 0.15,
    "neutral": 0.20,
    "compound": 0.50
  }
}
\`\`\`

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Invalid token
- `404 Not Found`: Company not found

## Add News Article

Adds a new news article.

**URL**: `/news`

**Method**: `POST`

**Auth required**: Yes (Admin or Data Provider)

**Request Body**:

\`\`\`json
{
  "title": "Merck's New Diabetes Drug Receives FDA Approval",
  "summary": "Merck & Co. announced today that its new diabetes drug has received FDA approval...",
  "content": "Merck & Co. (NYSE: MRK) announced today that its new diabetes drug has received FDA approval for the treatment of type 2 diabetes in adults...",
  "source": "PR Newswire",
  "author": "Jane Doe",
  "publishedAt": "2023-05-02T09:15:00Z",
  "url": "https://www.prnewswire.com/news/merck-diabetes-approval",
  "imageUrl": "https://example.com/images/merck-diabetes.jpg",
  "category": "regulatory",
  "companies": [
    {
      "id": "comp_987654321",
      "name": "Merck & Co.",
      "ticker": "MRK"
    }
  ],
  "tags": ["diabetes", "FDA approval", "type 2 diabetes"]
}
\`\`\`

**Response**:

\`\`\`json
{
  "id": "news_567890123",
  "title": "Merck's New Diabetes Drug Receives FDA Approval",
  "summary": "Merck & Co. announced today that its new diabetes drug has received FDA approval...",
  "content": "Merck & Co. (NYSE: MRK) announced today that its new diabetes drug has received FDA approval for the treatment of type 2 diabetes in adults...",
  "source": "PR Newswire",
  "author": "Jane Doe",
  "publishedAt": "2023-05-02T09:15:00Z",
  "url": "https://www.prnewswire.com/news/merck-diabetes-approval",
  "imageUrl": "https://example.com/images/merck-diabetes.jpg",
  "category": "regulatory",
  "companies": [
    {
      "id": "comp_987654321",
      "name": "Merck & Co.",
      "ticker": "MRK"
    }
  ],
  "sentiment": {
    "positive": 0.82,
    "negative": 0.03,
    "neutral": 0.15,
    "compound": 0.79
  },
  "tags": ["diabetes", "FDA approval", "type 2 diabetes"],
  "createdAt": "2023-05-02T09:20:00Z"
}
\`\`\`

**Status Codes**:
- `201 Created`: News article added successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions

## Update News Article

Updates an existing news article.

**URL**: `/news/:id`

**Method**: `PUT`

**Auth required**: Yes (Admin or Data Provider)

**URL Parameters**:
- `id` (string, required): News article ID

**Request Body**:

\`\`\`json
{
  "title": "Updated: Merck's New Diabetes Drug Receives FDA Approval",
  "summary": "Updated summary...",
  "tags": ["diabetes", "FDA approval", "type 2 diabetes", "Merck"]
}
\`\`\`

**Response**:

\`\`\`json
{
  "id": "news_567890123",
  "title": "Updated: Merck's New Diabetes Drug Receives FDA Approval",
  "summary": "Updated summary...",
  "content": "Merck & Co. (NYSE: MRK) announced today that its new diabetes drug has received FDA approval for the treatment of type 2 diabetes in adults...",
  "source": "PR Newswire",
  "author": "Jane Doe",
  "publishedAt": "2023-05-02T09:15:00Z",
  "url": "https://www.prnewswire.com/news/merck-diabetes-approval",
  "imageUrl": "https://example.com/images/merck-diabetes.jpg",
  "category": "regulatory",
  "companies": [
    {
      "id": "comp_987654321",
      "name": "Merck & Co.",
      "ticker": "MRK"
    }
  ],
  "sentiment": {
    "positive": 0.82,
    "negative": 0.03,
    "neutral": 0.15,
    "compound": 0.79
  },
  "tags": ["diabetes", "FDA approval", "type 2 diabetes", "Merck"],
  "updatedAt": "2023-05-02T10:30:00Z"
}
\`\`\`

**Status Codes**:
- `200 OK`: News article updated successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: News article not found

## Delete News Article

Deletes a news article.

**URL**: `/news/:id`

**Method**: `DELETE`

**Auth required**: Yes (Admin only)

**URL Parameters**:
- `id` (string, required): News article ID

**Response**:

\`\`\`json
{
  "message": "News article deleted successfully"
}
\`\`\`

**Status Codes**:
- `200 OK`: News article deleted successfully
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: News article not found
