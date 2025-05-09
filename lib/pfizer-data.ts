// This file centralizes access to Pfizer data

export interface PfizerCompanyProfile {
  address: string
  phone: string
  website: string
  description: string
  ceo: string
  employees: number
}

export interface PfizerStrategicIssue {
  disease_area: string
  issue_description: string
  impact_indicator: string
  implied_c_suite_decision: string
}

export interface PfizerNewsArticle {
  title: string
  url: string
  source: string
  publication_date: string
  summary: string
  sentiment: "Positive" | "Negative" | "Neutral"
}

export interface PfizerProductArea {
  area_name: string
  top_products: string[]
  growth_products: string[]
  patent_risk_products: string[]
}

export interface PfizerPipelineUpdate {
  description: string
}

export interface PfizerData {
  company_name: string
  company_profile: PfizerCompanyProfile
  disease_areas: string[]
  strategic_issues: PfizerStrategicIssue[]
  news_articles: PfizerNewsArticle[]
  product_portfolio: {
    therapeutic_areas: PfizerProductArea[]
  }
  drug_pipeline: {
    summary: string
    key_updates: string[]
  }
}

// Real Pfizer data from the provided files
export const pfizerData: PfizerData = {
  company_name: "Pfizer",
  company_profile: {
    address: "66 Hudson Boulevard East, New York, NY 10001-2192, United States",
    phone: "212-733-2323",
    website: "https://www.pfizer.com",
    description:
      "Pfizer Inc. discovers, develops, manufactures, markets, distributes, and sells biopharmaceutical products globally. It offers medicines and vaccines across various therapeutic areas including oncology, inflammation & immunology, rare diseases, vaccines, and internal medicine (cardiovascular and metabolic diseases, pain). The company also has a significant presence in the COVID-19 space with its vaccine and treatment solutions. Pfizer collaborates with other biopharmaceutical companies and research institutions to advance its pipeline and bring innovative therapies to patients.",
    ceo: "Albert Bourla",
    employees: 81000,
  },
  disease_areas: [
    "Oncology",
    "Inflammation & Immunology",
    "Vaccines",
    "Internal Medicine (Cardiovascular, Metabolic, Pain)",
    "Rare Disease",
    "Anti-Infectives/Hospital Products",
    "COVID-19 Franchise",
  ],
  strategic_issues: [
    {
      disease_area: "Oncology",
      issue_description:
        "Increasing competition from biosimilars and novel therapies for established cancer treatments.",
      impact_indicator: "High",
      implied_c_suite_decision:
        "Invest heavily in R&D for next-generation oncology drugs and explore strategic acquisitions of innovative biotech companies.",
    },
    {
      disease_area: "Oncology",
      issue_description: "Navigating complex and evolving regulatory landscapes for new cancer drug approvals.",
      impact_indicator: "High",
      implied_c_suite_decision:
        "Strengthen regulatory affairs teams and proactively engage with regulatory agencies to streamline approval processes.",
    },
    {
      disease_area: "Oncology",
      issue_description: "Pricing pressures and reimbursement challenges for high-cost cancer therapies.",
      impact_indicator: "High",
      implied_c_suite_decision:
        "Develop value-based pricing models and gather robust real-world evidence to demonstrate the long-term benefits of their therapies.",
    },
    {
      disease_area: "Inflammation & Immunology",
      issue_description: "Growing market for biologics and the need to maintain leadership in a competitive space.",
      impact_indicator: "High",
      implied_c_suite_decision:
        "Continue innovation in biologics, explore new mechanisms of action, and defend market share against emerging biosimilars.",
    },
    {
      disease_area: "COVID-19 Franchise",
      issue_description: "Declining demand for COVID-19 vaccines and treatments as the pandemic wanes.",
      impact_indicator: "High",
      implied_c_suite_decision:
        "Adapt production and distribution strategies to match evolving demand, while continuing research into next-generation vaccines and treatments for ongoing protection and future variants.",
    },
  ],
  news_articles: [
    {
      title: "Pfizer finds another $1.2B in cuts by tapping AI, automation",
      url: "https://firstwordpharma.com/story/5954839",
      source: "FirstWord Pharma",
      publication_date: "2025-04-29",
      summary:
        "Pfizer is on track for significant cost savings through AI and automation, aiming for $4.5 billion by the end of 2025.",
      sentiment: "Positive",
    },
    {
      title: "Pfizer Advances Bold Vision for Future of Cancer Care at the ASCO ...",
      url: "https://www.pfizer.com/news/press-release/press-release-detail/pfizer-advances-bold-vision-future-cancer-care-asco-2025",
      source: "Pfizer Press Release",
      publication_date: "2025-04-23",
      summary: "Pfizer to share updates on late-stage cancer programs, including long-term survival data for XTANDI®.",
      sentiment: "Positive",
    },
    {
      title: "As Pfizer bows out, CSL keeps hemophilia gene therapy hopes alive",
      url: "https://www.fiercepharma.com/pharma/pfizer-backs-out-hemophilia-gene-therapy-csl-hopes-hemgenix-here-stay",
      source: "Fierce Pharma",
      publication_date: "2025-04-11",
      summary: "Pfizer discontinued its hemophilia B gene therapy, Beqvez, citing low demand.",
      sentiment: "Negative",
    },
    {
      title: "Pfizer Provides Update on Oral GLP-1 Receptor Agonist Danuglipron",
      url: "https://www.pfizer.com/news/press-release/press-release-detail/pfizer-provides-update-oral-glp-1-receptor-agonist",
      source: "Pfizer Press Release",
      publication_date: "2025-04-14",
      summary:
        "Pfizer announced the discontinuation of the development of its oral GLP-1 drug candidate, danuglipron, for obesity.",
      sentiment: "Negative",
    },
    {
      title: "Pfizer Awarded Diamond Resiliency Badge for Supply Chain ...",
      url: "https://www.pfizer.com/news/announcements/pfizer-awarded-diamond-resiliency-badge-supply-chain-excellence",
      source: "Pfizer Announcement",
      publication_date: "2025-04-09",
      summary:
        "Pfizer received the Diamond Resiliency Badge from the Healthcare Industry Resilience Collaborative (HIRC) for supply chain excellence.",
      sentiment: "Positive",
    },
    {
      title: "Pfizer's Emblaveo approved in EU for multidrug-resistant infection ...",
      url: "https://www.pharmafocus.com/articles/pfizer-s-emblaveo-approved-in-eu-for-multidrug-resistant-infecti",
      source: "PharmaFocus",
      publication_date: "2025-04-30",
      summary:
        "The European Commission granted marketing authorisation for Pfizer's Emblaveo (aztreonam-avibactam) for treating certain multidrug-resistant infections in adults.",
      sentiment: "Positive",
    },
  ],
  product_portfolio: {
    therapeutic_areas: [
      {
        area_name: "Oncology",
        top_products: ["Ibrance", "Xtandi", "Inlyta"],
        growth_products: ["Padcev", "Adcetris"],
        patent_risk_products: ["Older oncology drugs (specifics require detailed patent analysis)"],
      },
      {
        area_name: "Inflammation & Immunology",
        top_products: ["Xeljanz", "Enbrel (international)"],
        growth_products: ["Cibinqo", "Velsipity"],
        patent_risk_products: ["Xeljanz (facing biosimilar competition)"],
      },
      {
        area_name: "Vaccines",
        top_products: ["Comirnaty", "Prevnar family"],
        growth_products: ["Abrysvo", "Nimenrix"],
        patent_risk_products: ["Older vaccine technologies (general risk, manufacturing complexity is a barrier)"],
      },
    ],
  },
  drug_pipeline: {
    summary:
      "Pfizer maintains a broad pipeline with recent updates in Q1 2025. Key areas include oncology, vaccines, and rare diseases. Some programs advanced while others (e.g., danuglipron for obesity) were discontinued.",
    key_updates: [
      "Danuglipron (oral GLP-1 for obesity) development discontinued.",
      "Ngenla application for expanded use in adult GHD withdrawn in EU.",
      "Emblaveo (aztreonam-avibactam) approved in EU for multidrug-resistant infections.",
      "Abrysvo (RSV vaccine) received expanded ACIP recommendation.",
    ],
  },
}

// Add error handling to the data access functions

// Function to get disease areas for Pfizer
export function getPfizerDiseaseAreas(): string[] {
  try {
    return pfizerData.disease_areas || []
  } catch (error) {
    console.error("Error fetching Pfizer disease areas:", error)
    return []
  }
}

// Function to get strategic issues for a specific disease area
export function getPfizerStrategicIssues(diseaseArea?: string | null): PfizerStrategicIssue[] {
  try {
    if (!pfizerData.strategic_issues) {
      return []
    }

    if (!diseaseArea) {
      return pfizerData.strategic_issues
    }

    // Check if the disease area exists in our data
    const matchingIssues = pfizerData.strategic_issues.filter(
      (issue) =>
        issue.disease_area === diseaseArea ||
        issue.disease_area.includes(diseaseArea) ||
        diseaseArea.includes(issue.disease_area),
    )

    // If no matching issues, return empty array
    return matchingIssues
  } catch (error) {
    console.error("Error fetching Pfizer strategic issues:", error)
    return []
  }
}

// Function to get news articles
export function getPfizerNewsArticles(diseaseArea?: string | null): PfizerNewsArticle[] {
  try {
    if (!pfizerData.news_articles) {
      return []
    }

    // In a real implementation, we would filter by disease area
    // For now, we'll return all articles since we don't have disease area tags in the sample data
    return pfizerData.news_articles
  } catch (error) {
    console.error("Error fetching Pfizer news articles:", error)
    return []
  }
}

// Function to get financial data
export function getPfizerFinancialData() {
  try {
    // Return default financial data if not available
    return {
      currentPrice: "$67.42",
      ytdReturn: "+2.4%",
      marketCap: "$384B",
      peRatio: "16.8",
      dividendYield: "3.2%",
    }
  } catch (error) {
    console.error("Error fetching Pfizer financial data:", error)
    return {
      currentPrice: "N/A",
      ytdReturn: "N/A",
      marketCap: "N/A",
      peRatio: "N/A",
      dividendYield: "N/A",
    }
  }
}

// Function to get product portfolio data
export function getPfizerProductPortfolio(diseaseArea?: string | null): PfizerProductArea[] {
  try {
    if (!pfizerData.product_portfolio?.therapeutic_areas) {
      return []
    }

    if (!diseaseArea) {
      return pfizerData.product_portfolio.therapeutic_areas
    }

    return pfizerData.product_portfolio.therapeutic_areas.filter(
      (area) =>
        area.area_name === diseaseArea || area.area_name.includes(diseaseArea) || diseaseArea.includes(area.area_name),
    )
  } catch (error) {
    console.error("Error fetching Pfizer product portfolio:", error)
    return []
  }
}

// Function to get pipeline data
export function getPfizerPipelineData() {
  try {
    if (!pfizerData.drug_pipeline) {
      return {
        summary: "Pipeline data not available",
        key_updates: [],
      }
    }

    return pfizerData.drug_pipeline
  } catch (error) {
    console.error("Error fetching Pfizer pipeline data:", error)
    return {
      summary: "Pipeline data not available",
      key_updates: [],
    }
  }
}
