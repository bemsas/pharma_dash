"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPfizerStrategicIssues } from "@/lib/pfizer-data"
import { useState, useEffect } from "react"

interface KeyIssuesCardProps {
  company: string
  diseaseArea?: string | null
}

export function KeyIssuesCard({ company, diseaseArea }: KeyIssuesCardProps) {
  // Use state to store the strategic issues
  const [strategicIssues, setStrategicIssues] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch strategic issues when company or diseaseArea changes
  useEffect(() => {
    setIsLoading(true)
    setError(null)

    try {
      // Only fetch Pfizer data if the company is Pfizer
      if (company === "Pfizer") {
        const issues = getPfizerStrategicIssues(diseaseArea)
        setStrategicIssues(issues || [])
      } else {
        // For other companies, set empty array
        setStrategicIssues([])
      }
    } catch (err) {
      console.error("Error fetching strategic issues:", err)
      setError("Failed to load strategic issues")
      setStrategicIssues([])
    } finally {
      setIsLoading(false)
    }
  }, [company, diseaseArea])

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Key Issues - Powered by AI</CardTitle>
        <CardDescription>
          Top strategic issues for the C-suite
          {diseaseArea && (
            <span className="ml-1">
              • <span className="font-medium">{diseaseArea}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : strategicIssues.length > 0 ? (
          <ul className="space-y-4 mt-2">
            {strategicIssues.map((issue, index) => (
              <li key={index} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{issue.issue_description}</span>
                  <Badge
                    className={`
                      rounded-full px-3 font-medium
                      ${
                        issue.impact_indicator === "High"
                          ? "bg-red-500 text-white"
                          : issue.impact_indicator === "Medium"
                            ? "bg-orange-500 text-white"
                            : "bg-yellow-500 text-white"
                      }
                    `}
                  >
                    {issue.impact_indicator} Impact
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    Disease Area: <span className="font-medium">{issue.disease_area}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">C-Suite Decision:</span>
                  <span>{issue.implied_c_suite_decision}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            {company === "Pfizer" && diseaseArea
              ? `No strategic issues found for ${diseaseArea}`
              : company === "Pfizer"
                ? "Select a disease area to view strategic issues"
                : "Select Pfizer to view real-time strategic issues data"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
