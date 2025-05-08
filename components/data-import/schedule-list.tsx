"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, RefreshCw, Trash2 } from "lucide-react"

interface ScheduleRecord {
  scheduleId: string
  type: string
  source: string
  schedule: string
  nextRun: string
  lastRun?: string
  status: "active" | "paused" | "deleted"
}

export default function ScheduleList() {
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null)

  async function fetchSchedules() {
    try {
      setIsLoading(true)
      setError(null)

      // In a real app, this would fetch from an API endpoint
      // For demo purposes, we'll simulate with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockSchedules: ScheduleRecord[] = [
        {
          scheduleId: "sch_1",
          type: "companies",
          source: "Bloomberg",
          schedule: "0 0 * * *",
          nextRun: new Date(Date.now() + 86400000).toISOString(),
          lastRun: new Date(Date.now() - 86400000).toISOString(),
          status: "active",
        },
        {
          scheduleId: "sch_2",
          type: "financials",
          source: "Reuters",
          schedule: "0 0 1 * *",
          nextRun: new Date(Date.now() + 1296000000).toISOString(),
          lastRun: new Date(Date.now() - 1296000000).toISOString(),
          status: "active",
        },
        {
          scheduleId: "sch_3",
          type: "news",
          source: "API",
          schedule: "0 */6 * * *",
          nextRun: new Date(Date.now() + 21600000).toISOString(),
          status: "active",
        },
      ]

      setSchedules(mockSchedules)
    } catch (err) {
      setError("Failed to fetch schedules")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [])

  function getStatusBadge(status: string) {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>
      case "paused":
        return <Badge variant="outline">Paused</Badge>
      case "deleted":
        return <Badge variant="destructive">Deleted</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  function formatCronExpression(cron: string) {
    const parts = cron.split(" ")
    if (parts.length !== 5) return cron

    // Simple cron expression descriptions
    if (cron === "0 0 * * *") return "Daily at midnight"
    if (cron === "0 0 * * 0") return "Weekly on Sunday"
    if (cron === "0 0 1 * *") return "Monthly (1st day)"
    if (cron === "0 0 1 1,4,7,10 *") return "Quarterly"

    return cron
  }

  async function handleDeleteSchedule() {
    if (!scheduleToDelete) return

    try {
      // In a real app, this would call an API endpoint
      // For demo purposes, we'll just update the local state
      setSchedules(schedules.filter((s) => s.scheduleId !== scheduleToDelete))

      // Close the dialog
      setDeleteDialogOpen(false)
      setScheduleToDelete(null)
    } catch (err) {
      setError("Failed to delete schedule")
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Active Schedules</h3>
        <Button variant="outline" size="sm" onClick={fetchSchedules} disabled={isLoading}>
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

      {isLoading && schedules.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : schedules.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No scheduled imports found</div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.scheduleId}>
                  <TableCell className="font-medium capitalize">{schedule.type}</TableCell>
                  <TableCell>{schedule.source}</TableCell>
                  <TableCell>
                    <span className="block">{formatCronExpression(schedule.schedule)}</span>
                    <span className="text-xs text-muted-foreground">{schedule.schedule}</span>
                  </TableCell>
                  <TableCell>{new Date(schedule.nextRun).toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setScheduleToDelete(schedule.scheduleId)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this import schedule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSchedule}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
