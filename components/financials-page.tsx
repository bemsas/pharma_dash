"use client"

import { TabsContent } from "@/components/ui/tabs"

import { useState } from "react"
import { DollarSign, Download, FileText, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Chart from "@/data-chart/line/1"
import BarChart1 from "@/data-chart/bar/1"
import { ChartWrapper } from "@/data-chart/wrapper"

export function FinancialsPage() {
  const [timeFilter, setTimeFilter] = useState("quarter")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-blue-600" />
            Financial Analysis
          </h1>
          <p className="text-muted-foreground">Financial performance and valuation metrics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="ttm">Trailing 12 Months</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
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

      {/* Financial Statement Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            <FileText className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="income"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            <FileText className="h-4 w-4 mr-2" />
            Income Statement
          </TabsTrigger>
          <TabsTrigger
            value="balance"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            <FileText className="h-4 w-4 mr-2" />
            Balance Sheet
          </TabsTrigger>
          <TabsTrigger
            value="cash"
            className="rounded-none border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-10"
          >
            <FileText className="h-4 w-4 mr-2" />
            Cash Flow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Quarterly revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartWrapper content={Chart} className="h-full w-full" title="Revenue Trend" />
                </div>
              </CardContent>
            </Card>

            {/* Profitability Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Profitability Metrics</CardTitle>
                <CardDescription>Key profitability ratios and margins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartWrapper content={BarChart1} className="h-full w-full" title="Profitability Metrics" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Key financial metrics and ratios</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>YoY Change</TableHead>
                    <TableHead>Industry Avg</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Revenue (TTM)</TableCell>
                    <TableCell>$81.3B</TableCell>
                    <TableCell className="text-green-600">+4.2%</TableCell>
                    <TableCell>$62.7B</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Gross Margin</TableCell>
                    <TableCell>68.4%</TableCell>
                    <TableCell className="text-green-600">+1.2%</TableCell>
                    <TableCell>65.8%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Operating Margin</TableCell>
                    <TableCell>28.7%</TableCell>
                    <TableCell className="text-green-600">+0.8%</TableCell>
                    <TableCell>26.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Net Income (TTM)</TableCell>
                    <TableCell>$21.7B</TableCell>
                    <TableCell className="text-green-600">+5.3%</TableCell>
                    <TableCell>$16.9B</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">EPS (TTM)</TableCell>
                    <TableCell>$3.85</TableCell>
                    <TableCell className="text-green-600">+6.1%</TableCell>
                    <TableCell>$3.12</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">P/E Ratio</TableCell>
                    <TableCell>17.5x</TableCell>
                    <TableCell className="text-red-600">-2.3%</TableCell>
                    <TableCell>19.2x</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Dividend Yield</TableCell>
                    <TableCell>3.2%</TableCell>
                    <TableCell className="text-green-600">+0.3%</TableCell>
                    <TableCell>2.8%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">R&D Expense (% of Revenue)</TableCell>
                    <TableCell>21.4%</TableCell>
                    <TableCell className="text-green-600">+1.7%</TableCell>
                    <TableCell>18.9%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income">
          <div className="py-10 text-center text-muted-foreground">Income Statement content will be displayed here</div>
        </TabsContent>

        <TabsContent value="balance">
          <div className="py-10 text-center text-muted-foreground">Balance Sheet content will be displayed here</div>
        </TabsContent>

        <TabsContent value="cash">
          <div className="py-10 text-center text-muted-foreground">Cash Flow content will be displayed here</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
