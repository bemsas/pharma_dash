import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react"

interface DemoKeyIssuesCardProps {
  companyName: string
}

export function DemoKeyIssuesCard({ companyName }: DemoKeyIssuesCardProps) {
  // Generate demo key issues based on the company name
  const demoIssues = [
    {
      id: 1,
      title: "Patent Expiration",
      description: `Key patents for ${companyName}'s blockbuster drugs are set to expire in the next 2-3 years.`,
      impact: "High",
      trend: "negative",
    },
    {
      id: 2,
      title: "Pipeline Development",
      description: `${companyName} has several promising candidates in late-stage clinical trials.`,
      impact: "Medium",
      trend: "positive",
    },
    {
      id: 3,
      title: "Regulatory Challenges",
      description: `Recent regulatory scrutiny may impact ${companyName}'s approval timeline.`,
      impact: "Medium",
      trend: "negative",
    },
    {
      id: 4,
      title: "Market Expansion",
      description: `${companyName} is expanding into emerging markets with significant growth potential.`,
      impact: "High",
      trend: "positive",
    },
    {
      id: 5,
      title: "Pricing Pressure",
      description: `Increasing pressure on drug pricing may affect ${companyName}'s revenue projections.`,
      impact: "Medium",
      trend: "negative",
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Key Issues (historic data)</CardTitle>
            <CardDescription>Strategic challenges for the C-suite</CardDescription>
          </div>
          <div className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">Demo Content</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {demoIssues.map((issue) => (
            <div key={issue.id} className="rounded-md border p-3">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-medium">{issue.title}</h3>
                <div className="flex items-center">
                  <span
                    className={`mr-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      issue.impact === "High" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {issue.impact} Impact
                  </span>
                  {issue.trend === "positive" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{issue.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center rounded-md bg-gray-50 p-3 text-sm text-gray-500">
          <AlertCircle className="mr-2 h-4 w-4" />
          <span>This is demo data. Create an account to see real strategic insights.</span>
        </div>
      </CardContent>
    </Card>
  )
}
