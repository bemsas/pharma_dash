"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FavoriteButton } from "./favorite-button"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for companies
const PHARMA_COMPANIES = [
  "Pfizer",
  "Johnson & Johnson",
  "Roche",
  "Novartis",
  "Merck",
  "GlaxoSmithKline",
  "Sanofi",
  "AbbVie",
  "Takeda",
  "Bayer",
  "Eli Lilly",
  "Bristol-Myers Squibb",
  "AstraZeneca",
  "Amgen",
  "Gilead Sciences",
  "Novo Nordisk",
  "Biogen",
  "Regeneron",
  "Vertex",
  "Moderna",
]

// Component that uses search params
function CompaniesPageWithSearchParams({ userFavorites }: { userFavorites: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const filteredCompanies = PHARMA_COMPANIES.filter((company) =>
    company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const favoriteCompanies = PHARMA_COMPANIES.filter((company) => userFavorites.includes(company))

  const handleCompanySelect = (company: string) => {
    router.push(`/dashboard?company=${encodeURIComponent(company)}`)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/companies?tab=${value}`)
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Pharmaceutical Companies</h1>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search for a company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All Companies</TabsTrigger>
          <TabsTrigger value="favorites">My Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((company) => (
              <Card key={company} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{company}</CardTitle>
                    <FavoriteButton company={company} initialIsFavorite={userFavorites.includes(company)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={() => handleCompanySelect(company)}>
                    View Dashboard
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          {favoriteCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteCompanies.map((company) => (
                <Card key={company} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{company}</CardTitle>
                      <FavoriteButton company={company} initialIsFavorite={true} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" onClick={() => handleCompanySelect(company)}>
                      View Dashboard
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">You haven't added any companies to your favorites yet.</p>
                <Button variant="outline" onClick={() => handleTabChange("all")}>
                  Browse All Companies
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}

// Loading fallback component
function CompaniesLoading() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Pharmaceutical Companies</h1>

      <div className="mb-6">
        <Skeleton className="h-10 w-[300px]" />
      </div>

      <div className="mb-4">
        <Skeleton className="h-10 w-[200px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

// Main component with Suspense boundary
export function CompaniesPage({ userFavorites }: { userFavorites: string[] }) {
  return (
    <Suspense fallback={<CompaniesLoading />}>
      <CompaniesPageWithSearchParams userFavorites={userFavorites} />
    </Suspense>
  )
}
