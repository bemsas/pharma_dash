import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface KeyIssuesCardProps {
  company: string
  diseaseArea?: string | null
}

export function KeyIssuesCard({ company, diseaseArea }: KeyIssuesCardProps) {
  // In a real application, we would fetch issues based on company and disease area
  // For now, we'll just display sample data that matches the image

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Key Issues - Powered by AI</CardTitle>
        <CardDescription>
          Top 5 strategic issues for the C-suite
          {diseaseArea && (
            <span className="ml-1">
              • <span className="font-medium">{diseaseArea}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4 mt-2">
          <li className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">Patent Cliff for Key Products</span>
              <Badge className="bg-red-500 text-white rounded-full px-3 font-medium">High Impact</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                Trend:{" "}
                <span className="flex items-center text-red-600">
                  <ArrowDown className="h-3 w-3" /> Negative
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">News Impact:</span>
              <span>Recent court ruling accelerates generic competition</span>
            </div>
          </li>

          <li className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">Pipeline Development</span>
              <Badge className="bg-orange-500 text-white rounded-full px-3 font-medium">Medium Impact</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                Trend:{" "}
                <span className="flex items-center text-green-600">
                  <ArrowUp className="h-3 w-3" /> Positive
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">News Impact:</span>
              <span>Phase 3 trial shows promising results for new oncology drug</span>
            </div>
          </li>

          <li className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">Pricing Pressure</span>
              <Badge className="bg-red-500 text-white rounded-full px-3 font-medium">High Impact</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                Trend:{" "}
                <span className="flex items-center text-red-600">
                  <ArrowDown className="h-3 w-3" /> Negative
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">News Impact:</span>
              <span>New legislation may cap drug prices</span>
            </div>
          </li>

          <li className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">Manufacturing Capacity</span>
              <Badge className="bg-orange-500 text-white rounded-full px-3 font-medium">Medium Impact</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                Trend: <span>Neutral</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">News Impact:</span>
              <span>No recent developments</span>
            </div>
          </li>

          <li className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">International Market Expansion</span>
              <Badge className="bg-yellow-500 text-white rounded-full px-3 font-medium">Low Impact</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                Trend:{" "}
                <span className="flex items-center text-green-600">
                  <ArrowUp className="h-3 w-3" /> Positive
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">News Impact:</span>
              <span>New approval in Asian markets</span>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
