"use client"

import { CardContent } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { getCompanyData, type CompanyData } from "@/app/actions/fetch-pharma-data"
import { trackCompanyView } from "@/app/actions/analytics"
import { KeyIssuesCard } from "@/components/key-issues-card"
import { InvestorDataCard } from "@/components/investor-data-card"
import { NewsArticlesList } from "@/components/news-articles-list"
import { getPfizerDiseaseAreas } from "@/lib/pfizer-data"

// Import the ErrorBoundary component
import { ErrorBoundary } from "@/components/error-boundary"

// Sample data for demonstration
const companies = [
  "Pfizer",
  "Johnson & Johnson",
  "Merck",
  "AbbVie",
  "Bristol Myers Squibb",
  "Novartis",
  "Roche",
  "GlaxoSmithKline",
]

export function DashboardContent() {
  // Initialize with default values
  const [selectedCompany, setSelectedCompany] = useState("Pfizer")
  const [selectedDiseaseArea, setSelectedDiseaseArea] = useState<string | null>(null)
  const [availableDiseaseAreas, setAvailableDiseaseAreas] = useState<string[]>([])
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)

  const router = useRouter()
  const searchParams = useSearchParams()

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // Set initial width
    setWindowWidth(window.innerWidth)

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Safely initialize from URL parameters after component mounts
  useEffect(() => {
    const companyParam = searchParams.get("company")
    const diseaseAreaParam = searchParams.get("diseaseArea")

    if (companyParam) {
      setSelectedCompany(companyParam)
    }

    if (diseaseAreaParam) {
      setSelectedDiseaseArea(diseaseAreaParam)
    }
  }, [searchParams])

  // Fetch company data when selectedCompany changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        if (selectedCompany === "Pfizer") {
          // Use real Pfizer disease areas
          const diseaseAreas = getPfizerDiseaseAreas()
          setAvailableDiseaseAreas(diseaseAreas)

          // Validate that the selected disease area exists
          if (selectedDiseaseArea && !diseaseAreas.includes(selectedDiseaseArea)) {
            console.warn(`Disease area "${selectedDiseaseArea}" not found for Pfizer`)
            // Don't reset it, just show empty state
          }

          // For other data, we'll still use the mock API for now
          const data = await getCompanyData(selectedCompany)
          setCompanyData(data)
        } else {
          // Get company data (this will use Redis cache if available)
          const data = await getCompanyData(selectedCompany)
          setCompanyData(data)
          setAvailableDiseaseAreas(data.diseaseAreas || [])
        }

        // Track this company view in analytics
        await trackCompanyView(selectedCompany)

        // Update URL parameters
        if (selectedDiseaseArea) {
          router.push(`/?company=${selectedCompany}&diseaseArea=${encodeURIComponent(selectedDiseaseArea)}`, {
            scroll: false,
          })
        } else {
          router.push(`/?company=${selectedCompany}`, { scroll: false })
        }
      } catch (err) {
        console.error("Error fetching company data:", err)
        setError("Failed to load company data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCompany, selectedDiseaseArea, router])

  // Handle company selection
  const handleCompanyChange = (company: string) => {
    setSelectedCompany(company)
    setSelectedDiseaseArea(null) // Reset disease area when company changes
  }

  // Handle disease area selection
  const handleDiseaseAreaChange = (diseaseArea: string | null) => {
    setSelectedDiseaseArea(diseaseArea)

    // Update URL parameters
    if (diseaseArea) {
      router.push(`/?company=${selectedCompany}&diseaseArea=${encodeURIComponent(diseaseArea)}`, { scroll: false })
    } else {
      router.push(`/?company=${selectedCompany}`, { scroll: false })
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedCompany("Pfizer")
    setSelectedDiseaseArea(null)
    router.push("/", { scroll: false })
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {/* Company Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
            <h1 className="text-xl font-semibold whitespace-nowrap">Filter for Company</h1>
            <div className="relative w-full sm:w-64">
              <Select value={selectedCompany} onValueChange={handleCompanyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company} {company === "Pfizer" && "(Real-time data)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Disease Area Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
            <h1 className="text-xl font-semibold whitespace-nowrap">Disease area filter</h1>
            <div className="relative w-full sm:w-80">
              <Select
                value={selectedDiseaseArea || "none"}
                onValueChange={(value) => handleDiseaseAreaChange(value === "none" ? null : value)}
                disabled={availableDiseaseAreas.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select disease area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {availableDiseaseAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset Button */}
          <div className="mt-2 md:mt-0">
            <Button variant="outline" size="icon" onClick={resetFilters}>
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Reset filters</span>
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          {error}
          <div className="mt-4">
            <Button onClick={resetFilters}>Reset Filters</Button>
          </div>
        </div>
      ) : companyData ? (
        <>
          {/* Content Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Key Issues Card */}
            <ErrorBoundary
              fallback={
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Key Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4 text-muted-foreground">Unable to load key issues</div>
                  </CardContent>
                </Card>
              }
            >
              <KeyIssuesCard company={selectedCompany} diseaseArea={selectedDiseaseArea} />
            </ErrorBoundary>

            {/* Investor Data Card */}
            <ErrorBoundary
              fallback={
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Investor Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4 text-muted-foreground">Unable to load investor data</div>
                  </CardContent>
                </Card>
              }
            >
              <InvestorDataCard company={selectedCompany} />
            </ErrorBoundary>
          </div>

          {/* News Articles */}
          <ErrorBoundary
            fallback={<div className="text-center py-8 text-muted-foreground">Unable to load news articles</div>}
          >
            <NewsArticlesList company={selectedCompany} diseaseArea={selectedDiseaseArea} />
          </ErrorBoundary>
        </>
      ) : (
        <div className="text-center py-8">No data available</div>
      )}
    </div>
  )
}
