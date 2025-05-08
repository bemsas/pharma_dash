"use client"

import { useState } from "react"
import { BarChart3, Brain, Download, LineChart, PieChart, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Chart from "@/data-chart/line/2"
import BarChart1 from "@/data-chart/bar/2"
import PieChart1 from "@/data-chart/pie/2"
import { ChartWrapper } from "@/data-chart/wrapper"

export function InsightsPage() {
  const [timeFilter, setTimeFilter] = useState("quarter")

  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-white p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              Pharma Industry Insights
            </h1>
            <p className="text-muted-foreground">AI-generated insights from financial and operational data</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="5year">5 Year Trend</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <Tabs defaultValue="trends">
            <TabsList>
              <TabsTrigger value="trends" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                Industry Trends
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Financial Analysis
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                Pipeline Analysis
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="space-y-6">
          {/* AI Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>AI-Generated Summary</CardTitle>
              <CardDescription>
                Based on data analysis from{" "}
                {timeFilter === "month"
                  ? "the last month"
                  : timeFilter === "quarter"
                    ? "the last quarter"
                    : timeFilter === "year"
                      ? "the last year"
                      : "the last 5 years"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  The pharmaceutical industry is experiencing significant transformation driven by several key factors.
                  R&D productivity has improved across major players, with an average 12% increase in late-stage
                  pipeline assets compared to the previous {timeFilter}. Oncology remains the dominant therapeutic area,
                  accounting for 38% of industry pipeline value, followed by immunology (22%) and rare diseases (17%).
                </p>
                <p>
                  Financial performance shows divergence among top companies. Those with recent successful launches
                  (particularly in oncology and immunology) are outperforming peers, with an average revenue growth of
                  8.3% versus the industry average of 4.7%. Margin pressure continues due to pricing constraints in
                  major markets, though companies with strong specialty portfolios are better insulated.
                </p>
                <p>
                  Patent cliffs remain a significant challenge, with $95 billion in branded sales at risk over the next
                  three years. Companies with robust biosimilar defenses and diversified portfolios show better
                  resilience in valuation multiples.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>R&D Productivity Trends</CardTitle>
                <CardDescription>Success rates by therapeutic area and phase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartWrapper content={Chart} className="h-full w-full" title="R&D Productivity Trends" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Badge variant="outline">Updated 2 days ago</Badge>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth by Therapeutic Area</CardTitle>
                <CardDescription>Comparative analysis across major categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartWrapper
                    content={BarChart1}
                    className="h-full w-full"
                    title="Revenue Growth by Therapeutic Area"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Badge variant="outline">Updated 3 days ago</Badge>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Pipeline Value Distribution</CardTitle>
                <CardDescription>Estimated future value by development phase and therapeutic area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartWrapper content={PieChart1} className="h-full w-full" title="Pipeline Value Distribution" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Badge variant="outline">Updated 1 day ago</Badge>
              </CardFooter>
            </Card>
          </div>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Strategic Insights</CardTitle>
              <CardDescription>AI-generated recommendations based on data analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Badge className="bg-blue-600">1</Badge>
                    M&A Opportunity Analysis
                  </h3>
                  <p className="mt-2">
                    Companies with strong cash positions should consider strategic acquisitions in the emerging cell and
                    gene therapy space. Valuations have decreased by an average of 34% in this segment over the past
                    year, creating potential value opportunities. Target companies with validated technology platforms
                    and early clinical data show the most promising risk-adjusted returns.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Badge className="bg-blue-600">2</Badge>
                    Pricing Strategy Optimization
                  </h3>
                  <p className="mt-2">
                    With increasing pricing pressure in major markets, companies should consider value-based contracting
                    models. Data shows that products with robust outcomes-based agreements have maintained 15% better
                    price stability compared to traditional pricing models. Focus on therapeutic areas where clinical
                    outcomes are clearly measurable.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Badge className="bg-blue-600">3</Badge>
                    R&D Portfolio Rebalancing
                  </h3>
                  <p className="mt-2">
                    Analysis suggests that companies should rebalance R&D portfolios toward high-unmet-need rare
                    diseases and precision oncology. These areas show 2.3x higher probability of regulatory success and
                    1.8x better return on investment compared to crowded therapeutic categories. Consider divesting from
                    areas with multiple established competitors.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="w-full">Generate Custom Insights Report</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
