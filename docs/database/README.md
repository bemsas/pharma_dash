# Database Schema Design

This document explains the design decisions behind the database schema for the Pharma Dashboard.

## Overview

The database schema is designed to support the following requirements:

1. Store and manage pharmaceutical company data
2. Track financial information over time
3. Store and analyze news articles
4. Manage pipeline products and clinical trials
5. Support user authentication and preferences
6. Enable data analysis and reporting

## Design Principles

The database schema follows these design principles:

1. **Normalization**: Tables are normalized to reduce data redundancy and improve data integrity.
2. **Scalability**: The schema is designed to handle large volumes of data.
3. **Performance**: Indexes are used to optimize query performance.
4. **Flexibility**: JSON fields are used for flexible data structures.
5. **Integrity**: Foreign keys and constraints ensure data integrity.

## Schema Diagram

\`\`\`
[Users] ←→ [User Saved Companies] ←→ [Companies]
   ↑                                     ↑
   |                                     |
[API Keys]                          [Key Issues]
   ↑                                     ↑
   |                                     |
[Audit Logs]                      [Financial Data]
                                        ↑
                                        |
[News Articles] ←→ [News Article Companies] ←→ [Companies]
   ↑
   |
[News Article Tags]
                                        
[Pipeline Products] ←→ [Pipeline Product Partners] ←→ [Companies]
   ↑
   |
[Pipeline Product Milestones]
   ↑
   |
[Clinical Trials]
\`\`\`

## Table Descriptions

### Users Table

Stores user account information, including authentication details and preferences.

- **Primary Key**: `id` (UUID)
- **Unique Constraints**: `email`
- **Indexes**: `email`, `role`
- **JSON Fields**: `preferences`

### Companies Table

Stores information about pharmaceutical companies.

- **Primary Key**: `id` (UUID)
- **Unique Constraints**: `ticker`
- **Indexes**: `ticker`, `category`

### Key Issues Table

Stores key strategic issues for companies.

- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `company_id` references `companies(id)`
- **Indexes**: `company_id`, `impact`

### Financial Data Table

Stores financial information for companies over time.

- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `company_id` references `companies(id)`
- **Unique Constraints**: `company_id`, `year`, `period`
- **Indexes**: `company_id`, `year`, `period`

### News Articles Table

Stores news articles related to pharmaceutical companies.

- **Primary Key**: `id` (UUID)
- **Unique Constraints**: `url`
- **Indexes**: `published_at`, `category`, `sentiment_compound`
- **Many-to-Many Relationships**: `news_article_companies` links to `companies`

### News Article Tags Table

Stores tags for news articles.

- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `news_article_id` references `news_articles(id)`
- **Unique Constraints**: `news_article_id`, `tag`
- **Indexes**: `tag`

### News Article Companies Table

Links news articles to companies (many-to-many relationship).

- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `news_article_id` references `news_articles(id)`, `company_id` references `companies(id)`
- **Unique Constraints**: `news_article_id`, `company_id`
- **Indexes**: `company_id`

### Pipeline Products Table

Stores information about pipeline products (drugs in development).

- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `company_id` references `companies(id)`
- **Indexes**: `company_id`, `status`, `phase`, `category`
- **JSON Fields**: `market_potential`

### Pipeline Product Partners Table

Links pipeline products to partner companies.

- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `pipeline_product_id` references `pipeline_products(id)`, `partner_company_id` references `companies(id)`
- **Unique Constraints**: `pipeline_product_id`, `partner_company_id`

### Pipeline Product Milestones Table

Stores milestones for pipeline products.

- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `pipeline_product_id` references `pipeline_products(id)`
- **Indexes**: `date`

### Clinical Trials Table

Stores information about clinical trials for pipeline products.

- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `pipeline_product_id` references `pipeline_products(id)`
- **Unique Constraints**: `trial_id`
- **Indexes**: `pipeline_product_id`, `phase`, `status`
- **JSON Fields**: `locations`

### User Saved Companies Table

Links users to companies they have saved (watchlists).

- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `user_id` references `users(id)`, `company_id` references `companies(id)`
- **Unique Constraints**: `user_id`, `company_id`

### User Saved News Articles Table

Links users to news articles they have saved (bookmarks).

- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `user_id` references `users(id)`, `news_article_id` references `news_articles(id)`
- **Unique Constraints**: `user_id`, `news_article_id`

### API Keys Table

Stores API keys for users.

- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `user_id` references `users(id)`
- **Unique Constraints**: `key_value`
- **Indexes**: `key_value`
- **JSON Fields**: `permissions`

### Audit Logs Table

Stores audit logs for user actions.

- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `user_id` references `users(id)`
- **Indexes**: `user_id`, `action`, `created_at`
- **JSON Fields**: `details`

## Data Types

### String Fields

- **VARCHAR(36)**: Used for UUIDs and IDs
- **VARCHAR(255)**: Used for names, titles, and URLs
- **VARCHAR(50)**: Used for categories, statuses, and roles
- **VARCHAR(10)**: Used for ticker symbols
- **TEXT**: Used for descriptions and content

### Numeric Fields

- **INT**: Used for years, counts, and small numeric values
- **BIGINT**: Used for large numeric values like revenue and market cap
- **DECIMAL(10, 2)**: Used for financial ratios and percentages

### Date and Time Fields

- **TIMESTAMP**: Used for dates and times

### JSON Fields

- **JSON**: Used for flexible data structures like preferences, market potential, and locations

## Indexing Strategy

The database uses the following indexing strategy:

1. **Primary Keys**: All tables have a primary key index
2. **Foreign Keys**: All foreign key columns are indexed
3. **Unique Constraints**: All unique constraint columns are indexed
4. **Search Fields**: Columns used in search queries are indexed
5. **Sort Fields**: Columns used for sorting are indexed
6. **Filter Fields**: Columns used for filtering are indexed

## Data Relationships

### One-to-Many Relationships

- One company has many key issues
- One company has many financial data records
- One company has many pipeline products
- One pipeline product has many milestones
- One pipeline product has many clinical trials
- One user has many API keys
- One user has many audit logs

### Many-to-Many Relationships

- Many news articles relate to many companies
- Many pipeline products have many partner companies
- Many users save many companies
- Many users save many news articles

## Data Integrity

Data integrity is ensured through:

1. **Foreign Key Constraints**: Ensure referential integrity
2. **Unique Constraints**: Prevent duplicate records
3. **Not Null Constraints**: Ensure required fields are provided
4. **Default Values**: Provide sensible defaults
5. **Cascading Deletes**: Automatically delete related records when a parent record is deleted

## Performance Considerations

The database schema is designed with the following performance considerations:

1. **Indexing**: Appropriate indexes are created to optimize query performance
2. **Normalization**: Tables are normalized to reduce data redundancy
3. **Denormalization**: Some data is denormalized for query performance
4. **JSON Fields**: JSON fields are used for flexible data structures
5. **Pagination**: The schema supports efficient pagination through indexed sort columns

## Scalability Considerations

The database schema is designed with the following scalability considerations:

1. **Sharding**: The schema can be sharded by company or by date
2. **Partitioning**: Large tables can be partitioned by date
3. **Archiving**: Old data can be archived to separate tables
4. **Read Replicas**: The schema supports read replicas for read-heavy workloads

## Future Enhancements

The database schema can be enhanced in the future with:

1. **Full-Text Search**: Add full-text search indexes for text fields
2. **Time-Series Data**: Add specialized tables for time-series financial data
3. **Graph Relationships**: Add graph database capabilities for relationship analysis
4. **Machine Learning Features**: Add tables for storing machine learning features and predictions
5. **Geospatial Data**: Add geospatial data for company locations and clinical trial sites
\`\`\`

Let's create a document explaining the API versioning strategy:
