# Pharma Dashboard API Documentation

## Overview

The Pharma Dashboard API provides endpoints for accessing and managing pharmaceutical company data, financial information, news articles, and user data. This API follows RESTful principles and uses JSON for data exchange.

## Base URL

\`\`\`
https://api.pharmadashboard.com/v1
\`\`\`

## Authentication

All API requests require authentication using JWT tokens. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN
\`\`\`

To obtain a token, use the `/auth/login` endpoint.

## Rate Limiting

API requests are limited to 100 requests per minute per user. Rate limit information is included in the response headers:

\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1620000000
\`\`\`

## Versioning

The API is versioned using URL path versioning (e.g., `/v1/companies`). The current version is v1.

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests. Error responses include a JSON object with an error message:

\`\`\`json
{
  "error": "Invalid request parameters",
  "code": "INVALID_PARAMS",
  "details": {
    "field": "name",
    "message": "Name is required"
  }
}
\`\`\`

## API Endpoints

- [Authentication](/docs/api/auth.md)
- [Companies](/docs/api/companies.md)
- [Financial Data](/docs/api/financials.md)
- [News Articles](/docs/api/news.md)
- [Pipeline](/docs/api/pipeline.md)
- [User Management](/docs/api/users.md)
\`\`\`

Now, let's create detailed documentation for each endpoint category:
