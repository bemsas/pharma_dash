import { getPopularCompanies } from "@/app/actions/analytics"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get limit from query parameter or use default
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "5", 10)

    // Get popular companies from Redis
    const popularCompanies = await getPopularCompanies(limit)

    return NextResponse.json({ popularCompanies })
  } catch (error) {
    console.error("Error fetching popular companies:", error)
    return NextResponse.json({ error: "Failed to fetch popular companies" }, { status: 500 })
  }
}
