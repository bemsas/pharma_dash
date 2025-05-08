# Financial Data API

## Get Company Financials

Returns financial data for a specific company.

**URL**: `/financials/companies/:companyId`

**Method**: `GET`

**Auth required**: Yes

**URL Parameters**:
- `companyId` (string, required): Company ID

**Query Parameters**:
- `period` (string, optional): Time period ("quarterly", "annual", default: "annual")
- `years` (integer, optional): Number of years of data to return (default: 5)
- `metrics` (string, optional): Comma-separated list of metrics to include (default: all)

**Response**:

\`\`\`json
{
  "companyId": "comp_123456789",
  "companyName": "Pfizer Inc.",
  "ticker": "PFE",
  "period": "annual",
  "data": [
    {
      "year": 2022,
      "revenue": 81500000000,
      "netIncome": 21500000000,
      "eps": 3.85,
      "rnd": 9500000000,
      "assets": 211700000000,
      "liabilities": 119800000000,
      "equity": 91900000000,
      "cashFlow": 18700000000,
      "dividends": 8900000000,
      "marketCap": 212500000000,
      "peRatio": 9.88,
      "pbRatio": 2.31,
      "debtToEquity": 1.30,
      "roe": 23.40,
      "roi": 12.70
    },
    // More years...
  ],
  "trends": {
    "revenue": {
      "cagr": 8.5,
      "trend": "increasing"
    },
    "netIncome": {
      "cagr": 10.2,
      "trend": "increasing"
    },
    "rnd": {
      "cagr": 7.9,
      "trend": "increasing"
    }
  }
}
\`\`\`

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Invalid token
- `404 Not Found`: Company not found

## Get Industry Financials

Returns aggregated financial data for an industry or category.

**URL**: `/financials/industry/:category`

**Method**: `GET`

**Auth required**: Yes

**URL Parameters**:
- `category` (string, required): Industry category (e.g., "pharma", "biotech")

**Query Parameters**:
- `period` (string, optional): Time period ("quarterly", "annual", default: "annual")
- `years` (integer, optional): Number of years of data to return (default: 5)
- `metrics` (string, optional): Comma-separated list of metrics to include (default: all)

**Response**:

\`\`\`json
{
  "category": "pharma",
  "period": "annual",
  "companies": 25,
  "data": [
    {
      "year": 2022,
      "averageRevenue": 45200000000,
      "averageNetIncome": 12300000000,
      "averageEps": 3.12,
      "averageRnd": 5700000000,
      "averagePeRatio": 12.5,
      "averagePbRatio": 2.8,
      "averageDebtToEquity": 1.15,
      "averageRoe": 18.7,
      "averageRoi": 10.5,
      "totalMarketCap": 2850000000000
    },
    // More years...
  ],
  "trends": {
    "averageRevenue": {
      "cagr": 6.8,
      "trend": "increasing"
    },
    "averageNetIncome": {
      "cagr": 7.5,
      "trend": "increasing"
    },
    "averageRnd": {
      "cagr": 8.2,
      "trend": "increasing"
    }
  }
}
\`\`\`

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Invalid token
- `404 Not Found`: Category not found

## Get Financial Metrics

Returns specific financial metrics for comparison across companies.

**URL**: `/financials/metrics/:metric`

**Method**: `GET`

**Auth required**: Yes

**URL Parameters**:
- `metric` (string, required): Financial metric (e.g., "revenue", "netIncome", "rnd")

**Query Parameters**:
- `companies` (string, required): Comma-separated list of company IDs
- `period` (string, optional): Time period ("quarterly", "annual", default: "annual")
- `years` (integer, optional): Number of years of data to return (default: 5)

**Response**:

\`\`\`json
{
  "metric": "revenue",
  "period": "annual",
  "companies": [
    {
      "id": "comp_123456789",
      "name": "Pfizer Inc.",
      "ticker": "PFE",
      "data": [
        { "year": 2022, "value": 81500000000 },
        { "year": 2021, "value": 78500000000 },
        { "year": 2020, "value": 41900000000 },
        { "year": 2019, "value": 51750000000 },
        { "year": 2018, "value": 53600000000 }
      ],
      "cagr": 11.0
    },
    {
      "id": "comp_987654321",
      "name": "Merck & Co.",
      "ticker": "MRK",
      "data": [
        { "year": 2022, "value": 59300000000 },
        { "year": 2021, "value": 48700000000 },
        { "year": 2020, "value": 47900000000 },
        { "year": 2019, "value": 46800000000 },
        { "year": 2018, "value": 42300000000 }
      ],
      "cagr": 8.8
    }
    // More companies...
  ]
}
\`\`\`

**Status Codes**:
- `200 OK`: Request successful
- `400 Bad Request`: Invalid metric or companies
- `401 Unauthorized`: Invalid token

## Add Financial Data

Adds new financial data for a company.

**URL**: `/financials/companies/:companyId`

**Method**: `POST`

**Auth required**: Yes (Admin only)

**URL Parameters**:
- `companyId` (string, required): Company ID

**Request Body**:

\`\`\`json
{
  "year": 2023,
  "period": "annual",
  "revenue": 85200000000,
  "netIncome": 22800000000,
  "eps": 4.05,
  "rnd": 10200000000,
  "assets": 220500000000,
  "liabilities": 125300000000,
  "equity": 95200000000,
  "cashFlow": 19500000000,
  "dividends": 9200000000,
  "marketCap": 225000000000,
  "peRatio": 9.95,
  "pbRatio": 2.36,
  "debtToEquity": 1.32,
  "roe": 24.0,
  "roi": 13.1
}
\`\`\`

**Response**:

\`\`\`json
{
  "id": "fin_123456789",
  "companyId": "comp_123456789",
  "year": 2023,
  "period": "annual",
  "revenue": 85200000000,
  "netIncome": 22800000000,
  "eps": 4.05,
  "rnd": 10200000000,
  "assets": 220500000000,
  "liabilities": 125300000000,
  "equity": 95200000000,
  "cashFlow": 19500000000,
  "dividends": 9200000000,
  "marketCap": 225000000000,
  "peRatio": 9.95,
  "pbRatio": 2.36,
  "debtToEquity": 1.32,
  "roe": 24.0,
  "roi": 13.1,
  "createdAt": "2023-05-01T12:00:00Z"
}
\`\`\`

**Status Codes**:
- `201 Created`: Financial data added successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Company not found
- `409 Conflict`: Financial data for this period already exists

## Update Financial Data

Updates existing financial data for a company.

**URL**: `/financials/companies/:companyId/:year`

**Method**: `PUT`

**Auth required**: Yes (Admin only)

**URL Parameters**:
- `companyId` (string, required): Company ID
- `year` (integer, required): Year of the financial data

**Query Parameters**:
- `period` (string, optional): Time period ("quarterly", "annual", default: "annual")

**Request Body**:

\`\`\`json
{
  "revenue": 85500000000,
  "netIncome": 23000000000,
  "rnd": 10300000000
}
\`\`\`

**Response**:

\`\`\`json
{
  "id": "fin_123456789",
  "companyId": "comp_123456789",
  "year": 2023,
  "period": "annual",
  "revenue": 85500000000,
  "netIncome": 23000000000,
  "eps": 4.05,
  "rnd": 10300000000,
  "assets": 220500000000,
  "liabilities": 125300000000,
  "equity": 95200000000,
  "cashFlow": 19500000000,
  "dividends": 9200000000,
  "marketCap": 225000000000,
  "peRatio": 9.95,
  "pbRatio": 2.36,
  "debtToEquity": 1.32,
  "roe": 24.0,
  "roi": 13.1,
  "updatedAt": "2023-05-02T12:00:00Z"
}
\`\`\`

**Status Codes**:
- `200 OK`: Financial data updated successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Company or financial data not found

## Delete Financial Data

Deletes financial data for a company.

**URL**: `/financials/companies/:companyId/:year`

**Method**: `DELETE`

**Auth required**: Yes (Admin only)

**URL Parameters**:
- `companyId` (string, required): Company ID
- `year` (integer, required): Year of the financial data

**Query Parameters**:
- `period` (string, optional): Time period ("quarterly", "annual", default: "annual")

**Response**:

\`\`\`json
{
  "message": "Financial data deleted successfully"
}
\`\`\`

**Status Codes**:
- `200 OK`: Financial data deleted successfully
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Company or financial data not found
