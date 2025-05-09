import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPfizerPipelineData } from "@/lib/pfizer-data"

interface PipelineDataCardProps {
  company: string
}

export function PipelineDataCard({ company }: PipelineDataCardProps) {
  // Only show for Pfizer
  if (company !== "Pfizer") {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>Pipeline Updates</CardTitle>
          <CardDescription>Recent drug development updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">Select Pfizer to view real-time pipeline data</div>
        </CardContent>
      </Card>
    )
  }

  // Get pipeline data using the error-handling function
  const pipelineData = getPfizerPipelineData()

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Pipeline Updates</CardTitle>
        <CardDescription>Recent drug development updates (Q1 2025)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Pipeline Summary</h3>
            <p className="text-sm text-gray-700">{pipelineData.summary}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Key Updates</h3>
            <ul className="space-y-2">
              {pipelineData.key_updates.map((update, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Badge className="mt-0.5 bg-blue-100 text-blue-800 hover:bg-blue-100">Update</Badge>
                  <span className="text-sm">{update}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2">
            <p className="text-xs text-gray-500 italic">Source: Pfizer Q1 2025 pipeline update (April 29, 2025)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
