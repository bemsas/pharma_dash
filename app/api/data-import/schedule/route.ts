import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { redis } from "@/lib/redis"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { parseExpression } from "cron-parser"

// Define validation schema for schedule request
const scheduleRequestSchema = z.object({
  type: z.enum(["companies", "financials", "news", "pipeline"]),
  source: z.string().optional(),
  schedule: z.string(),
  config: z.record(z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Authentication required", code: "UNAUTHORIZED" }, { status: 401 })
    }

    // Check if user has admin role
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to perform this operation", code: "FORBIDDEN" },
        { status: 403 },
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = scheduleRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          code: "INVALID_REQUEST",
          details: validationResult.error.format(),
        },
        { status: 400 },
      )
    }

    const { type, source, schedule, config } = validationResult.data

    // Validate cron expression
    try {
      const interval = parseExpression(schedule)
      const nextRun = interval.next().toDate()
    } catch (error) {
      return NextResponse.json(
        {
          error: "Invalid schedule format",
          code: "INVALID_SCHEDULE",
          details: "Schedule must be a valid cron expression",
        },
        { status: 400 },
      )
    }

    // Generate schedule ID
    const scheduleId = uuidv4()

    // Calculate next run time
    const interval = parseExpression(schedule)
    const nextRun = interval.next().toDate().toISOString()

    // Store schedule
    await redis.set(`schedule:${scheduleId}`, {
      scheduleId,
      type,
      source: source || "scheduled",
      schedule,
      config: config || {},
      nextRun,
      status: "active",
      createdAt: new Date().toISOString(),
      userId: session.user.id,
    })

    return NextResponse.json({
      success: true,
      message: "Import scheduled successfully",
      scheduleId,
      nextRun,
    })
  } catch (error) {
    console.error("Error scheduling import:", error)
    return NextResponse.json({ error: "Internal server error", code: "SERVER_ERROR" }, { status: 500 })
  }
}
