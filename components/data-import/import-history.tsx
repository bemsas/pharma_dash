"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"

interface ImportRecord {
  importId: string
  type: string
  source: string
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
  recordsProcessed: number
  recordsTotal: number
  startTime: string
  endTime?: string
  error?: string
}

export default function ImportHistory() {
  const [imports, setImports] = useState<ImportRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchImports() {
    try {
      setIsLoading(true)
      setError(null)

      // In a real app, this would fetch from an API endpoint
      // For demo purposes, we'll simulate with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockImports: ImportRecord[] = [
        {
          importId: "imp_1",
          type: "companies",
          source: "manual",
          status: "completed",
          progress: 100,
          recordsProcessed: 5,
          recordsTotal: 5,
          startTime: new Date(Date.now() - 3600000).toISOString(),
          endTime: new Date(Date.now() - 3590000).toISOString(),
        },
        {
          importId: "imp_2",
          type: "financials",
          source: "Bloomberg",
          status: "completed",
          progress: 100,
          recordsProcessed: 15,
          recordsTotal: 15,
          startTime: new Date(Date.now() - 7200000).toISOString(),
          endTime: new Date(Date.now() - 7180000).toISOString(),
        },
        {
          importId: "imp_3",
          type: "news",
          source: "Reuters",
          status: "failed",
          progress: 60,
          recordsProcessed: 6,
          recordsTotal: 10,
          startTime: new Date(Date.now() - 10800000).toISOString(),
          endTime: new Date(Date.now() - 10790000).toISOString(),
          error: "API rate limit exceeded",
        },
      ]

      setImports(mockImports)
    } catch (err) {
      setError("Failed to fetch import history")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchImports()
  }, [])

  function getStatusBadge(status: string) {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>
      case "processing":
        return <Badge variant="default">Processing</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Recent Imports</h3>
        <Button variant="outline" size="sm" onClick={fetchImports} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">{error}</div>}

      {isLoading && imports.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : imports.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No import history found</div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imports.map((imp) => (
                <TableRow key={imp.importId}>
                  <TableCell className="font-medium capitalize">{imp.type}</TableCell>
                  <TableCell>{imp.source}</TableCell>
                  <TableCell>{getStatusBadge(imp.status)}</TableCell>
                  <TableCell>
                    {imp.recordsProcessed} / {imp.recordsTotal}
                  </TableCell>
                  <TableCell>{new Date(imp.startTime).toLocaleString()}</TableCell>
                  <TableCell>
                    {imp.endTime
                      ? `${Math.round((new Date(imp.endTime).getTime() - new Date(imp.startTime).getTime()) / 1000)}s`
                      : "In progress"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
