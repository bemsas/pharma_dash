"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import ImportVolumeChart from "./charts/import-volume-chart"
import ImportSuccessRateChart from "./charts/import-success-rate-chart"
import ImportDurationChart from "./charts/import-duration-chart"
import ImportTypeDistributionChart from "./charts/import-type-distribution-chart"
import ImportSourceDistributionChart from "./charts/import-source-distribution-chart"
import ImportTrendChart from "./charts/import-trend-chart"
import { fetchImportStatistics } from "@/app/actions/import-statistics-actions"

export default function ImportStatistics() {
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState(null)
  const [timeRange, setTimeRange] = useState("30d")
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [dataType, setDataType] = useState("all")

  useEffect(() => {
    loadStatistics()
  }, [timeRange, dataType, dateRange])

  const loadStatistics = async () => {
    setLoading(true)
    try {
      const stats = await fetchImportStatistics({
        timeRange,
        dataType,
        dateRange:
          dateRange.from && dateRange.to
            ? {
                from: dateRange.from.toISOString(),
                to: dateRange.to.toISOString(),
              }
            : undefined,
      })
      setStatistics(stats)
    } catch (error) {
      console.error("Error loading import statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadStatistics()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Import Statistics</h1>
          <p className="text-gray-600 mt-2">Visualize and analyze your data import metrics and trends</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Time Range</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            {timeRange === "custom" && (
              <div className="mt-4">
                <DateRangePicker value={dateRange} onChange={setDateRange} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Data Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger>
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="companies">Companies</SelectItem>
                <SelectItem value="financials">Financials</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="pipeline">Pipeline</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Total Imports:</span> {statistics?.summary?.totalImports || 0}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Success Rate:</span> {statistics?.summary?.successRate || 0}%
                </p>
                <p className="text-sm">
                  <span className="font-medium">Records Imported:</span> {statistics?.summary?.totalRecords || 0}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Volume</CardTitle>
                <CardDescription>Number of imports over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ImportVolumeChart data={statistics?.volumeData || []} />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Success Rate</CardTitle>
                <CardDescription>Percentage of successful imports</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ImportSuccessRateChart data={statistics?.successRateData || []} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Import Trends</CardTitle>
              <CardDescription>Import volume and success rate over time</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ImportTrendChart data={statistics?.trendData || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Type Distribution</CardTitle>
                <CardDescription>Imports by data type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ImportTypeDistributionChart data={statistics?.typeDistribution || []} />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Source Distribution</CardTitle>
                <CardDescription>Imports by data source</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ImportSourceDistributionChart data={statistics?.sourceDistribution || []} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Import Duration</CardTitle>
              <CardDescription>Average time to complete imports (seconds)</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ImportDurationChart data={statistics?.durationData || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
