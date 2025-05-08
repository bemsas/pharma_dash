"use server"

import { incrementCounter, setCache, getCache } from "@/lib/redis"

// Track page views
export async function trackPageView(page: string): Promise<void> {
  // Increment total page views counter
  await incrementCounter("analytics:pageviews:total")

  // Increment specific page counter
  await incrementCounter(`analytics:pageviews:${page}`)

  // Track daily views
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
  await incrementCounter(`analytics:pageviews:${page}:${today}`)
}

// Track company views
export async function trackCompanyView(company: string): Promise<void> {
  // Increment company view counter
  await incrementCounter(`analytics:company:${company.toLowerCase()}:views`)

  // Update popular companies list
  const popularCompanies = (await getCache<Record<string, number>>("analytics:popular_companies")) || {}
  popularCompanies[company] = (popularCompanies[company] || 0) + 1
  await setCache("analytics:popular_companies", popularCompanies, 60 * 60 * 24 * 30) // 30 days
}

// Track search queries
export async function trackSearch(query: string): Promise<void> {
  // Increment search counter
  await incrementCounter("analytics:searches:total")

  // Store search query
  const searchQueries = (await getCache<string[]>("analytics:recent_searches")) || []
  searchQueries.unshift(query)

  // Keep only the most recent 100 searches
  if (searchQueries.length > 100) {
    searchQueries.pop()
  }

  await setCache("analytics:recent_searches", searchQueries, 60 * 60 * 24 * 7) // 7 days
}

// Get popular companies
export async function getPopularCompanies(limit = 5): Promise<Array<{ name: string; views: number }>> {
  const popularCompanies = (await getCache<Record<string, number>>("analytics:popular_companies")) || {}

  return Object.entries(popularCompanies)
    .map(([name, views]) => ({ name, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}
