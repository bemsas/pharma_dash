"use server"

import { getCache, setCache } from "@/lib/redis"

// Types for our pharmaceutical data
export interface CompanyData {
  name: string
  diseaseAreas: string[]
  keyIssues: Array<{
    title: string
    trend: "positive" | "negative" | "neutral"
    impact: "high" | "medium" | "low"
    newsImpact: string
  }>
  financialData: {
    currentPrice: string
    ytdReturn: string
    marketCap: string
    peRatio: string
    dividendYield: string
  }
  newsArticles: Array<{
    id: number
    title: string
    source: string
    date: string
    snippet: string
    sentiment: "positive" | "negative" | "neutral"
    category: string
  }>
}

// Mock function to simulate API call to external data source
async function fetchCompanyDataFromAPI(company: string): Promise<CompanyData> {
  // In a real app, this would be an actual API call
  // For demo purposes, we're simulating a delay and returning mock data
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // This is just mock data - in a real app, you'd fetch from an actual API
  return {
    name: company,
    diseaseAreas: [
      "NSCLC (non small cell lung cancer)",
      "Breast Cancer",
      "Cardiovascular Disease",
      "COVID-19",
      "Rheumatoid Arthritis",
    ],
    keyIssues: [
      {
        title: "Patent Cliff for Key Products",
        trend: "negative",
        impact: "high",
        newsImpact: "Recent court ruling accelerates generic competition",
      },
      {
        title: "Pipeline Development",
        trend: "positive",
        impact: "medium",
        newsImpact: "Phase 3 trial shows promising results for new oncology drug",
      },
      {
        title: "Pricing Pressure",
        trend: "negative",
        impact: "high",
        newsImpact: "New legislation may cap drug prices",
      },
    ],
    financialData: {
      currentPrice: "$67.42",
      ytdReturn: "+2.4%",
      marketCap: "$384B",
      peRatio: "16.8",
      dividendYield: "3.2%",
    },
    newsArticles: [
      {
        id: 1,
        title: `${company} Announces Breakthrough in Cancer Treatment Research`,
        source: "MedicalNews Today",
        date: "2025-05-01",
        snippet: `Pharmaceutical giant ${company} has announced promising results from a Phase 3 clinical trial for its new oncology drug targeting rare forms of lung cancer.`,
        sentiment: "positive",
        category: "Research",
      },
      {
        id: 2,
        title: `${company}'s New Breast Cancer Drug Shows Promise in Early Trials`,
        source: "Cancer Research Journal",
        date: "2025-04-18",
        snippet: `${company}'s experimental breast cancer treatment has shown promising results in early-stage clinical trials, potentially offering a new option for patients with specific genetic markers.`,
        sentiment: "positive",
        category: "Research",
      },
    ],
  }
}

// Function to get company data with Redis caching
export async function getCompanyData(company: string): Promise<CompanyData> {
  // Create a cache key based on the company name
  const cacheKey = `company:${company.toLowerCase()}`

  // Try to get data from Redis cache first
  const cachedData = await getCache<CompanyData>(cacheKey)

  // If we have cached data, return it
  if (cachedData) {
    console.log(`Cache hit for ${company}`)
    return cachedData
  }

  // If no cached data, fetch from API
  console.log(`Cache miss for ${company}, fetching from API`)
  const data = await fetchCompanyDataFromAPI(company)

  // Store in Redis cache with 1 hour expiration (3600 seconds)
  await setCache(cacheKey, data, 3600)

  return data
}

// Function to get disease area data for a specific company
export async function getDiseaseAreaData(company: string, diseaseArea: string) {
  // Create a cache key for this specific company + disease area combination
  const cacheKey = `company:${company.toLowerCase()}:disease:${diseaseArea.toLowerCase()}`

  // Try to get from cache first
  const cachedData = await getCache(cacheKey)
  if (cachedData) return cachedData

  // If not in cache, we'd fetch from API and then cache it
  // For demo purposes, we'll just return a mock response
  const data = {
    company,
    diseaseArea,
    pipelineAssets: [
      { name: "PF-07321332", phase: "Phase 3", targetDate: "2025-Q4" },
      { name: "PF-06826647", phase: "Phase 2", targetDate: "2026-Q2" },
    ],
    marketSize: "$4.2B",
    competitors: ["AstraZeneca", "Roche", "Merck"],
  }

  // Cache for 1 hour
  await setCache(cacheKey, data, 3600)

  return data
}
