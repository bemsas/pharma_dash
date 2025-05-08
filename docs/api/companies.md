# Companies API

## Get All Companies

Returns a paginated list of pharmaceutical companies.

**URL**: `/companies`

**Method**: `GET`

**Auth required**: Yes

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Number of results per page (default: 20)
- `sort` (string, optional): Field to sort by (default: "name")
- `order` (string, optional): Sort order ("asc" or "desc", default: "asc")
- `search` (string, optional): Search term for company name
- `filter` (string, optional): Filter by category (e.g., "biotech", "pharma")

**Response**:

\`\`\`json
{
  "data": [
    {
      "id": "comp_123456789",
      "name": "Pfizer Inc.",
      "ticker": "PFE",
      "logo": "https://example.com/logos/pfizer.png",
      "category": "pharma",
      "description": "Pfizer Inc. is an American multinational pharmaceutical corporation...",
      "foundedYear": 1849,
      "headquarters": "New York, USA",
      "employeeCount": 88000,
      "website": "https://www.pfizer.com",
      "marketCap": 212500000000
    },
    // More companies...
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
\`\`\`

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Invalid token

## Get Company by ID

Returns detailed information about a specific company.

**URL**: `/companies/:id`

**Method**: `GET`

**Auth required**: Yes

**URL Parameters**:
- `id` (string, required): Company ID

**Response**:

\`\`\`json
{
  "id": "comp_123456789",
  "name": "Pfizer Inc.",
  "ticker": "PFE",
  "logo": "https://example.com/logos/pfizer.png",
  "category": "pharma",
  "description": "Pfizer Inc. is an American multinational pharmaceutical corporation...",
  "foundedYear": 1849,
  "headquarters": "New York, USA",
  "employeeCount": 88000,
  "website": "https://www.pfizer.com",
  "marketCap": 212500000000,
  "keyIssues": [
    {
      "id": "issue_123",
      "title": "Patent Expiration",
      "description": "Key patents expiring in 2023",
      "impact": "high",
      "category": "legal"
    }
    // More issues...
  ],
  "financialSummary": {
    "revenue": {
      "current": 81500000000,
      "previous": 78500000000,
      "growth": 3.82
    },
    "netIncome": {
      "current": 21500000000,
      "previous": 19500000000,
      "growth": 10.26
    },
    "rnd": {
      "current": 9500000000,
      "previous": 8800000000,
      "growth": 7.95
    }
  }
}
\`\`\`

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Invalid token
- `404 Not Found`: Company not found

## Create Company

Creates a new company record.

**URL**: `/companies`

**Method**: `POST`

**Auth required**: Yes (Admin only)

**Request Body**:

\`\`\`json
{
  "name": "New Pharma Inc.",
  "ticker": "NPH",
  "logo": "https://example.com/logos/newpharma.png",
  "category": "biotech",
  "description": "New Pharma Inc. is a biotechnology company...",
  "foundedYear": 2010,
  "headquarters": "Boston, USA",
  "employeeCount": 1200,
  "website": "https://www.newpharma.com"
}
\`\`\`

**Response**:

\`\`\`json
{
  "id": "comp_987654321",
  "name": "New Pharma Inc.",
  "ticker": "NPH",
  "logo": "https://example.com/logos/newpharma.png",
  "category": "biotech",
  "description": "New Pharma Inc. is a biotechnology company...",
  "foundedYear": 2010,
  "headquarters": "Boston, USA",
  "employeeCount": 1200,
  "website": "https://www.newpharma.com",
  "createdAt": "2023-05-01T12:00:00Z"
}
\`\`\`

**Status Codes**:
- `201 Created`: Company created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions

## Update Company

Updates an existing company record.

**URL**: `/companies/:id`

**Method**: `PUT`

**Auth required**: Yes (Admin only)

**URL Parameters**:
- `id` (string, required): Company ID

**Request Body**:

\`\`\`json
{
  "name": "Updated Pharma Inc.",
  "employeeCount": 1500,
  "description": "Updated description..."
}
\`\`\`

**Response**:

\`\`\`json
{
  "id": "comp_987654321",
  "name": "Updated Pharma Inc.",
  "ticker": "NPH",
  "logo": "https://example.com/logos/newpharma.png",
  "category": "biotech",
  "description": "Updated description...",
  "foundedYear": 2010,
  "headquarters": "Boston, USA",
  "employeeCount": 1500,
  "website": "https://www.newpharma.com",
  "updatedAt": "2023-05-02T12:00:00Z"
}
\`\`\`

**Status Codes**:
- `200 OK`: Company updated successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Company not found

## Delete Company

Deletes a company record.

**URL**: `/companies/:id`

**Method**: `DELETE`

**Auth required**: Yes (Admin only)

**URL Parameters**:
- `id` (string, required): Company ID

**Response**:

\`\`\`json
{
  "message": "Company deleted successfully"
}
\`\`\`

**Status Codes**:
- `200 OK`: Company deleted successfully
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Company not found
