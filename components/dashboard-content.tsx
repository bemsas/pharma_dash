"use client"

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
      try {
        // Get company data (this will use Redis cache if available)
        const data = await getCompanyData(selectedCompany)
        setCompanyData(data)
        setAvailableDiseaseAreas(data.diseaseAreas)

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
      } catch (error) {
        console.error("Error fetching company data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCompany, selectedDiseaseArea, router])

  // Handle company selection
  const handleCompanyChange = (company: string) => {
    setSelectedCompany(company)
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
                      {company}
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
      ) : companyData ? (
        <>
          {/* Content Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Key Issues Card */}
            <KeyIssuesCard company={selectedCompany} diseaseArea={selectedDiseaseArea} />

            {/* Investor Data Card */}
            <InvestorDataCard company={selectedCompany} />
          </div>

          {/* News Articles */}
          <NewsArticlesList company={selectedCompany} diseaseArea={selectedDiseaseArea} />
        </>
      ) : (
        <div className="text-center py-8">No data available</div>
      )}
    </div>
  )
}
