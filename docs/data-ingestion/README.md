# Data Ingestion Process

This document outlines the data ingestion process for the Pharma Dashboard, including data sources, transformation steps, and storage.

## Overview

The Pharma Dashboard ingests data from various sources, including:

1. Financial data feeds
2. News APIs
3. Clinical trial databases
4. Company filings
5. User-submitted content

Data is processed through a pipeline that includes validation, transformation, sentiment analysis, and storage in the database.

## Data Ingestion Flow

\`\`\`
[Data Sources] → [Data Collection] → [Validation] → [Transformation] → [Enrichment] → [Storage] → [Indexing]
\`\`\`

### 1. Data Collection

Data is collected from various sources using:

- **API Integrations**: Direct connections to data provider APIs
- **Web Scraping**: For publicly available data
- **File Imports**: CSV, Excel, or JSON file uploads
- **Manual Entry**: Through admin interfaces

### 2. Validation

All incoming data undergoes validation to ensure:

- Data completeness
- Data format correctness
- Data consistency
- Duplicate detection

### 3. Transformation

Data is transformed to match the database schema:

- Field mapping
- Data type conversion
- Normalization
- Standardization of values

### 4. Enrichment

Data is enriched with additional information:

- **Sentiment Analysis**: For news articles and reports
- **Entity Recognition**: Identifying companies, drugs, diseases
- **Categorization**: Assigning categories to news and pipeline products
- **Relationship Mapping**: Connecting related entities

### 5. Storage

Processed data is stored in the database according to the schema.

### 6. Indexing

Data is indexed for efficient querying and search.

## Data Sources

### Financial Data

- **Source**: Financial data providers (e.g., Alpha Vantage, Yahoo Finance)
- **Frequency**: Daily updates
- **Format**: JSON
- **Endpoint**: `/api/v1/financials/ingest`

### News Articles

- **Source**: News APIs (e.g., NewsAPI, Bloomberg)
- **Frequency**: Real-time or hourly updates
- **Format**: JSON
- **Endpoint**: `/api/v1/news/ingest`
- **Processing**: Includes sentiment analysis and entity extraction

### Clinical Trials

- **Source**: ClinicalTrials.gov, EU Clinical Trials Register
- **Frequency**: Weekly updates
- **Format**: XML, JSON
- **Endpoint**: `/api/v1/pipeline/trials/ingest`

### Company Information

- **Source**: Company websites, SEC filings
- **Frequency**: Monthly updates or on significant changes
- **Format**: Various
- **Endpoint**: `/api/v1/companies/ingest`

## Example Data Intake Scenarios

### Scenario 1: News Article Ingestion

1. **Collection**: News article is retrieved from a news API
2. **Validation**: Article is checked for required fields and format
3. **Transformation**: Article is transformed to match the database schema
4. **Enrichment**:
   - Sentiment analysis is performed on the article text
   - Companies mentioned in the article are identified
   - Article is categorized based on content
   - Tags are extracted from the content
5. **Storage**: Article is stored in the `news_articles` table
6. **Relationships**: Connections to companies are stored in `news_article_companies`
7. **Tags**: Article tags are stored in `news_article_tags`

**Example Request**:

\`\`\`json
POST /api/v1/news/ingest
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "title": "Pfizer Announces Positive Phase 3 Results for New Cancer Drug",
  "summary": "Pfizer Inc. announced today positive results from its Phase 3 clinical trial...",
  "content": "Pfizer Inc. (NYSE: PFE) announced today positive results from its Phase 3 clinical trial for its new cancer drug, showing a 40% reduction in disease progression...",
  "source": "BusinessWire",
  "author": "John Smith",
  "publishedAt": "2023-05-01T10:30:00Z",
  "url": "https://www.businesswire.com/news/pfizer-phase3-results",
  "imageUrl": "https://example.com/images/pfizer-trial.jpg"
}
\`\`\`

**Example Response**:

\`\`\`json
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
  "companies": [
    {
      "id": "comp_123456789",
      "name": "Pfizer Inc.",
      "ticker": "PFE"
    }
  ],
  "tags": ["cancer", "clinical trial", "phase 3", "oncology"],
  "createdAt": "2023-05-01T10:35:00Z"
}
\`\`\`

**Database Entries**:

\`\`\`sql
-- news_articles table
INSERT INTO news_articles (
  id, title, summary, content, source, author, published_at, url, image_url, 
  category, sentiment_positive, sentiment_negative, sentiment_neutral, sentiment_compound, 
  created_at, updated_at
) VALUES (
  'news_123456789', 
  'Pfizer Announces Positive Phase 3 Results for New Cancer Drug',
  'Pfizer Inc. announced today positive results from its Phase 3 clinical trial...',
  'Pfizer Inc. (NYSE: PFE) announced today positive results from its Phase 3 clinical trial for its new cancer drug, showing a 40% reduction in disease progression...',
  'BusinessWire',
  'John Smith',
  '2023-05-01T10:30:00Z',
  'https://www.businesswire.com/news/pfizer-phase3-results',
  'https://example.com/images/pfizer-trial.jpg',
  'clinical-trials',
  0.78,
  0.05,
  0.17,
  0.73,
  '2023-05-01T10:35:00Z',
  '2023-05-01T10:35:00Z'
);

-- news_article_companies table
INSERT INTO news_article_companies (
  id, news_article_id, company_id
) VALUES (
  'nac_123456789',
  'news_123456789',
  'comp_123456789'
);

-- news_article_tags table
INSERT INTO news_article_tags (
  id, news_article_id, tag
) VALUES 
  ('nat_123456789', 'news_123456789', 'cancer'),
  ('nat_123456790', 'news_123456789', 'clinical trial'),
  ('nat_123456791', 'news_123456789', 'phase 3'),
  ('nat_123456792', 'news_123456789', 'oncology');
\`\`\`

### Scenario 2: Financial Data Ingestion

1. **Collection**: Financial data is retrieved from a financial data provider
2. **Validation**: Data is checked for required fields and format
3. **Transformation**: Data is transformed to match the database schema
4. **Storage**: Data is stored in the `financial_data` table

**Example Request**:

\`\`\`json
POST /api/v1/financials/ingest
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "companyId": "comp_123456789",
  "year": 2022,
  "period": "annual",
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
}
\`\`\`

**Example Response**:

\`\`\`json
{
  "id": "fin_123456789",
  "companyId": "comp_123456789",
  "year": 2022,
  "period": "annual",
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
  "roi": 12.70,
  "createdAt": "2023-05-01T11:00:00Z"
}
\`\`\`

**Database Entry**:

\`\`\`sql
-- financial_data table
INSERT INTO financial_data (
  id, company_id, year, period, revenue, net_income, eps, rnd, 
  assets, liabilities, equity, cash_flow, dividends, market_cap, 
  pe_ratio, pb_ratio, debt_to_equity, roe, roi, created_at, updated_at
) VALUES (
  'fin_123456789',
  'comp_123456789',
  2022,
  'annual',
  81500000000,
  21500000000,
  3.85,
  9500000000,
  211700000000,
  119800000000,
  91900000000,
  18700000000,
  8900000000,
  212500000000,
  9.88,
  2.31,
  1.30,
  23.40,
  12.70,
  '2023-05-01T11:00:00Z',
  '2023-05-01T11:00:00Z'
);
\`\`\`

### Scenario 3: Pipeline Product Ingestion

1. **Collection**: Pipeline product data is retrieved from a clinical trial database
2. **Validation**: Data is checked for required fields and format
3. **Transformation**: Data is transformed to match the database schema
4. **Storage**: Data is stored in the `pipeline_products` table and related tables

**Example Request**:

\`\`\`json
POST /api/v1/pipeline/products/ingest
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "name": "PF-07321332",
  "description": "Oral antiviral treatment for COVID-19",
  "category": "infectious-diseases",
  "status": "approved",
  "phase": "marketed",
  "indication": "COVID-19",
  "mechanism": "SARS-CoV-2 main protease inhibitor",
  "startDate": "2020-03-15T00:00:00Z",
  "completionDate": "2021-12-22T00:00:00Z",
  "companyId": "comp_123456789",
  "marketPotential": {
    "peakSales": 22000000000,
    "probability": 100
  },
  "partners": [
    {
      "id": "comp_987654321",
      "role": "development partner"
    }
  ],
  "milestones": [
    {
      "date": "2021-11-05T00:00:00Z",
      "description": "Positive Phase 2/3 results announced",
      "type": "clinical"
    },
    {
      "date": "2021-12-22T00:00:00Z",
      "description": "FDA Emergency Use Authorization",
      "type": "regulatory"
    }
  ],
  "clinicalTrials": [
    {
      "trialId": "NCT04756531",
      "title": "Study of PF-07321332 in Healthy Adults",
      "phase": "Phase 1",
      "status": "Completed",
      "startDate": "2021-03-23T00:00:00Z",
      "completionDate": "2021-05-15T00:00:00Z",
      "participants": 60,
      "locations": ["United States", "Belgium"]
    }
  ]
}
\`\`\`

**Example Response**:

\`\`\`json
{
  "id": "prod_123456789",
  "name": "PF-07321332",
  "description": "Oral antiviral treatment for COVID-19",
  "category": "infectious-diseases",
  "status": "approved",
  "phase": "marketed",
  "indication": "COVID-19",
  "mechanism": "SARS-CoV-2 main protease inhibitor",
  "startDate": "2020-03-15T00:00:00Z",
  "completionDate": "2021-12-22T00:00:00Z",
  "company": {
    "id": "comp_123456789",
    "name": "Pfizer Inc.",
    "ticker": "PFE"
  },
  "marketPotential": {
    "peakSales": 22000000000,
    "probability": 100
  },
  "partners": [
    {
      "id": "comp_987654321",
      "name": "BioNTech SE",
      "role": "development partner"
    }
  ],
  "milestones": [
    {
      "date": "2021-11-05T00:00:00Z",
      "description": "Positive Phase 2/3 results announced",
      "type": "clinical"
    },
    {
      "date": "2021-12-22T00:00:00Z",
      "description": "FDA Emergency Use Authorization",
      "type": "regulatory"
    }
  ],
  "clinicalTrials": [
    {
      "id": "trial_123456789",
      "trialId": "NCT04756531",
      "title": "Study of PF-07321332 in Healthy Adults",
      "phase": "Phase 1",
      "status": "Completed",
      "startDate": "2021-03-23T00:00:00Z",
      "completionDate": "2021-05-15T00:00:00Z",
      "participants": 60,
      "locations": ["United States", "Belgium"]
    }
  ],
  "createdAt": "2023-05-01T12:00:00Z"
}
\`\`\`

**Database Entries**:

\`\`\`sql
-- pipeline_products table
INSERT INTO pipeline_products (
  id, company_id, name, description, category, status, phase, 
  indication, mechanism, start_date, completion_date, market_potential, 
  created_at, updated_at
) VALUES (
  'prod_123456789',
  'comp_123456789',
  'PF-07321332',
  'Oral antiviral treatment for COVID-19',
  'infectious-diseases',
  'approved',
  'marketed',
  'COVID-19',
  'SARS-CoV-2 main protease inhibitor',
  '2020-03-15T00:00:00Z',
  '2021-12-22T00:00:00Z',
  '{"peakSales": 22000000000, "probability": 100}',
  '2023-05-01T12:00:00Z',
  '2023-05-01T12:00:00Z'
);

-- pipeline_product_partners table
INSERT INTO pipeline_product_partners (
  id, pipeline_product_id, partner_company_id, role
) VALUES (
  'ppp_123456789',
  'prod_123456789',
  'comp_987654321',
  'development partner'
);

-- pipeline_product_milestones table
INSERT INTO pipeline_product_milestones (
  id, pipeline_product_id, date, description, type
) VALUES 
  ('ppm_123456789', 'prod_123456789', '2021-11-05T00:00:00Z', 'Positive Phase 2/3 results announced', 'clinical'),
  ('ppm_123456790', 'prod_123456789', '2021-12-22T00:00:00Z', 'FDA Emergency Use Authorization', 'regulatory');

-- clinical_trials table
INSERT INTO clinical_trials (
  id, pipeline_product_id, trial_id, title, phase, status, 
  start_date, completion_date, participants, locations
) VALUES (
  'trial_123456789',
  'prod_123456789',
  'NCT04756531',
  'Study of PF-07321332 in Healthy Adults',
  'Phase 1',
  'Completed',
  '2021-03-23T00:00:00Z',
  '2021-05-15T00:00:00Z',
  60,
  '["United States", "Belgium"]'
);
\`\`\`

## Data Transformation and Cleaning

### Text Normalization

- Convert text to lowercase
- Remove special characters
- Remove HTML tags
- Standardize whitespace

### Date Standardization

- Convert all dates to ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
- Handle different timezone representations

### Number Formatting

- Standardize number formats (e.g., currency values in USD)
- Handle different number representations (e.g., "1.2M" to 1200000)

### Entity Normalization

- Standardize company names (e.g., "Pfizer Inc." and "Pfizer" are treated as the same entity)
- Map ticker symbols to company IDs

## Rate Limiting and Authentication

### Rate Limits

- Standard tier: 100 requests per minute
- Premium tier: 1000 requests per minute
- Enterprise tier: Custom limits

### Authentication

- API key authentication for all endpoints
- JWT token authentication for user-specific endpoints
- OAuth 2.0 for third-party integrations

## Error Handling

### Error Codes

- 400: Bad Request (invalid parameters)
- 401: Unauthorized (invalid API key)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource not found)
- 409: Conflict (duplicate resource)
- 422: Unprocessable Entity (validation error)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

### Error Response Format

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "revenue",
        "message": "Revenue must be a positive number"
      }
    ]
  }
}
\`\`\`

## Versioning

The API is versioned using URL path versioning (e.g., `/v1/companies`). When a new version is released, the previous version will be supported for at least 12 months.

## Monitoring and Logging

All data ingestion processes are monitored and logged for:

- Performance metrics
- Error rates
- Data quality issues
- Usage patterns

Logs are stored in a centralized logging system and can be accessed through the admin dashboard.
\`\`\`

Let's create a document explaining the database schema design:
