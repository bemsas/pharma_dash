"use server"

import { redis } from "@/lib/redis"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

interface StatisticsParams {
  timeRange?: string
  dataType?: string
  dateRange?: {
    from: string
    to: string
  }
}

export async function fetchImportStatistics(params: StatisticsParams = {}) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      throw new Error("Authentication required")
    }

    // Get all import logs
    const importLogKeys = await redis.keys("import:log:*")
    let importLogs = []

    for (const key of importLogKeys) {
      const log = await redis.get(key)
      if (log) {
        importLogs.push({
          ...log,
          timestamp: new Date(log.timestamp),
          id: key.replace("import:log:", ""),
        })
      }
    }

    // Apply filters
    if (params.dataType && params.dataType !== "all") {
      importLogs = importLogs.filter((log) => log.type === params.dataType)
    }

    if (params.dateRange?.from && params.dateRange?.to) {
      const fromDate = new Date(params.dateRange.from)
      const toDate = new Date(params.dateRange.to)
      importLogs = importLogs.filter((log) => {
        const logDate = new Date(log.timestamp)
        return logDate >= fromDate && logDate <= toDate
      })
    } else if (params.timeRange) {
      const now = new Date()
      const fromDate = new Date()

      switch (params.timeRange) {
        case "7d":
          fromDate.setDate(now.getDate() - 7)
          break
        case "30d":
          fromDate.setDate(now.getDate() - 30)
          break
        case "90d":
          fromDate.setDate(now.getDate() - 90)
          break
        case "1y":
          fromDate.setFullYear(now.getFullYear() - 1)
          break
        default:
          fromDate.setDate(now.getDate() - 30) // Default to 30 days
      }

      importLogs = importLogs.filter((log) => new Date(log.timestamp) >= fromDate)
    }

    // Sort logs by timestamp
    importLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    // Generate statistics
    const statistics = generateStatistics(importLogs)

    return statistics
  } catch (error) {
    console.error("Error fetching import statistics:", error)
    throw error
  }
}

function generateStatistics(importLogs) {
  // Summary statistics
  const totalImports = importLogs.length
  const successfulImports = importLogs.filter((log) => log.success).length
  const successRate = totalImports > 0 ? Math.round((successfulImports / totalImports) * 100) : 0
  const totalRecords = importLogs.reduce((sum, log) => sum + (log.recordCount || 0), 0)

  // Group by date for volume and success rate charts
  const dateGroups = groupByDate(importLogs)

  const volumeData = Object.entries(dateGroups).map(([date, logs]) => ({
    date,
    imports: logs.length,
  }))

  const successRateData = Object.entries(dateGroups).map(([date, logs]) => {
    const successful = logs.filter((log) => log.success).length
    return {
      date,
      successRate: logs.length > 0 ? Math.round((successful / logs.length) * 100) : 0,
    }
  })

  // Trend data combining volume and success rate
  const trendData = Object.entries(dateGroups).map(([date, logs]) => {
    const successful = logs.filter((log) => log.success).length
    const recordsImported = logs.reduce((sum, log) => sum + (log.recordCount || 0), 0)
    return {
      date,
      imports: logs.length,
      successRate: logs.length > 0 ? Math.round((successful / logs.length) * 100) : 0,
      recordsImported,
    }
  })

  // Type distribution
  const typeGroups = groupByField(importLogs, "type")
  const typeDistribution = Object.entries(typeGroups).map(([type, logs]) => ({
    type: type || "Unknown",
    value: logs.length,
  }))

  // Source distribution
  const sourceGroups = groupByField(importLogs, "source")
  const sourceDistribution = Object.entries(sourceGroups).map(([source, logs]) => ({
    source: source || "Unknown",
    value: logs.length,
  }))

  // Duration data
  const durationByType = {}
  importLogs.forEach((log) => {
    if (log.duration) {
      if (!durationByType[log.type]) {
        durationByType[log.type] = []
      }
      durationByType[log.type].push(log.duration)
    }
  })

  const durationData = Object.entries(durationByType).map(([type, durations]) => ({
    type,
    duration: durations.reduce((sum, duration) => sum + duration, 0) / durations.length,
  }))

  return {
    summary: {
      totalImports,
      successfulImports,
      successRate,
      totalRecords,
    },
    volumeData,
    successRateData,
    trendData,
    typeDistribution,
    sourceDistribution,
    durationData,
  }
}

function groupByDate(logs) {
  const groups = {}

  logs.forEach((log) => {
    const date = new Date(log.timestamp).toISOString().split("T")[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(log)
  })

  return groups
}

function groupByField(logs, field) {
  const groups = {}

  logs.forEach((log) => {
    const value = log[field] || "Unknown"
    if (!groups[value]) {
      groups[value] = []
    }
    groups[value].push(log)
  })

  return groups
}
