-- Database Schema for Pharma Dashboard

-- Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_token_expires_at TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expires_at TIMESTAMP,
    preferences JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Companies Table
CREATE TABLE companies (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ticker VARCHAR(10) UNIQUE,
    logo_url VARCHAR(255),
    category VARCHAR(50),
    description TEXT,
    founded_year INT,
    headquarters VARCHAR(255),
    employee_count INT,
    website VARCHAR(255),
    market_cap BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_ticker ON companies(ticker);
CREATE INDEX idx_companies_category ON companies(category);

-- Key Issues Table
CREATE TABLE key_issues (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    impact VARCHAR(50) NOT NULL, -- high, medium, low
    category VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE INDEX idx_key_issues_company_id ON key_issues(company_id);
CREATE INDEX idx_key_issues_impact ON key_issues(impact);

-- Financial Data Table
CREATE TABLE financial_data (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    year INT NOT NULL,
    period VARCHAR(20) NOT NULL, -- annual, q1, q2, q3, q4
    revenue BIGINT,
    net_income BIGINT,
    eps DECIMAL(10, 2),
    rnd BIGINT,
    assets BIGINT,
    liabilities BIGINT,
    equity BIGINT,
    cash_flow BIGINT,
    dividends BIGINT,
    market_cap BIGINT,
    pe_ratio DECIMAL(10, 2),
    pb_ratio DECIMAL(10, 2),
    debt_to_equity DECIMAL(10, 2),
    roe DECIMAL(10, 2),
    roi DECIMAL(10, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE (company_id, year, period)
);

CREATE INDEX idx_financial_data_company_id ON financial_data(company_id);
CREATE INDEX idx_financial_data_year ON financial_data(year);
CREATE INDEX idx_financial_data_period ON financial_data(period);

-- News Articles Table
CREATE TABLE news_articles (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content TEXT,
    source VARCHAR(100),
    author VARCHAR(100),
    published_at TIMESTAMP NOT NULL,
    url VARCHAR(255) UNIQUE,
    image_url VARCHAR(255),
    category VARCHAR(50),
    sentiment_positive DECIMAL(5, 4),
    sentiment_negative DECIMAL(5, 4),
    sentiment_neutral DECIMAL(5, 4),
    sentiment_compound DECIMAL(5, 4),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_articles_published_at ON news_articles(published_at);
CREATE INDEX idx_news_articles_category ON news_articles(category);
CREATE INDEX idx_news_articles_sentiment_compound ON news_articles(sentiment_compound);

-- News Article Tags Table
CREATE TABLE news_article_tags (
    id VARCHAR(36) PRIMARY KEY,
    news_article_id VARCHAR(36) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    FOREIGN KEY (news_article_id) REFERENCES news_articles(id) ON DELETE CASCADE,
    UNIQUE (news_article_id, tag)
);

CREATE INDEX idx_news_article_tags_tag ON news_article_tags(tag);

-- News Article Companies Table (for many-to-many relationship)
CREATE TABLE news_article_companies (
    id VARCHAR(36) PRIMARY KEY,
    news_article_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (news_article_id) REFERENCES news_articles(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE (news_article_id, company_id)
);

CREATE INDEX idx_news_article_companies_company_id ON news_article_companies(company_id);

-- Pipeline Products Table
CREATE TABLE pipeline_products (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    status VARCHAR(50) NOT NULL,
    phase VARCHAR(50) NOT NULL,
    indication VARCHAR(255),
    mechanism VARCHAR(255),
    start_date TIMESTAMP,
    estimated_completion_date TIMESTAMP,
    completion_date TIMESTAMP,
    market_potential JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE INDEX idx_pipeline_products_company_id ON pipeline_products(company_id);
CREATE INDEX idx_pipeline_products_status ON pipeline_products(status);
CREATE INDEX idx_pipeline_products_phase ON pipeline_products(phase);
CREATE INDEX idx_pipeline_products_category ON pipeline_products(category);

-- Pipeline Product Partners Table
CREATE TABLE pipeline_product_partners (
    id VARCHAR(36) PRIMARY KEY,
    pipeline_product_id VARCHAR(36) NOT NULL,
    partner_company_id VARCHAR(36) NOT NULL,
    role VARCHAR(50),
    FOREIGN KEY (pipeline_product_id) REFERENCES pipeline_products(id) ON DELETE CASCADE,
    FOREIGN KEY (partner_company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE (pipeline_product_id, partner_company_id)
);

-- Pipeline Product Milestones Table
CREATE TABLE pipeline_product_milestones (
    id VARCHAR(36) PRIMARY KEY,
    pipeline_product_id VARCHAR(36) NOT NULL,
    date TIMESTAMP NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50),
    FOREIGN KEY (pipeline_product_id) REFERENCES pipeline_products(id) ON DELETE CASCADE
);

CREATE INDEX idx_pipeline_product_milestones_date ON pipeline_product_milestones(date);

-- Clinical Trials Table
CREATE TABLE clinical_trials (
    id VARCHAR(36) PRIMARY KEY,
    pipeline_product_id VARCHAR(36) NOT NULL,
    trial_id VARCHAR(50) UNIQUE,
    title VARCHAR(255) NOT NULL,
    phase VARCHAR(50),
    status VARCHAR(50),
    start_date TIMESTAMP,
    completion_date TIMESTAMP,
    participants INT,
    locations JSON,
    FOREIGN KEY (pipeline_product_id) REFERENCES pipeline_products(id) ON DELETE CASCADE
);

CREATE INDEX idx_clinical_trials_pipeline_product_id ON clinical_trials(pipeline_product_id);
CREATE INDEX idx_clinical_trials_phase ON clinical_trials(phase);
CREATE INDEX idx_clinical_trials_status ON clinical_trials(status);

-- User Saved Companies Table (for watchlists)
CREATE TABLE user_saved_companies (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE (user_id, company_id)
);

-- User Saved News Articles Table (for bookmarks)
CREATE TABLE user_saved_news_articles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    news_article_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (news_article_id) REFERENCES news_articles(id) ON DELETE CASCADE,
    UNIQUE (user_id, news_article_id)
);

-- API Keys Table
CREATE TABLE api_keys (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    key_value VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    permissions JSON,
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_api_keys_key_value ON api_keys(key_value);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(36),
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
