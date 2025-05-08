"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { KeyIssuesCard } from "./key-issues-card"
import { InvestorDataCard } from "./investor-data-card"
import { NewsArticlesList } from "./news-articles-list"
import { CompanySelector } from "./company-selector"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Create a wrapper component for the search params functionality
function DashboardWithSearchParams({ userFavorites }: { userFavorites: string[] }) {
  const searchParams = useSearchParams()
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  useEffect(() => {
    const company = searchParams.get("company")
    if (company) {
      setSelectedCompany(company)
    }
  }, [searchParams])

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Filter for Company - {selectedCompany || "All Companies"}</h1>
        <CompanySelector userFavorites={userFavorites} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <KeyIssuesCard company={selectedCompany} />
        <InvestorDataCard company={selectedCompany} />
      </div>

      <div className="mb-6">
        <NewsArticlesList company={selectedCompany} />
      </div>
    </>
  )
}

// Loading fallback component
function DashboardLoading() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Filter for Company - Loading...</h1>
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Main component with Suspense boundary
export function DashboardContent({ userFavorites }: { userFavorites: string[] }) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardWithSearchParams userFavorites={userFavorites} />
    </Suspense>
  )
}
