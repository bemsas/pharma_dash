import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redis } from "@/lib/redis"

export async function GET(request: NextRequest, { params }: { params: { scheduleId: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Authentication required", code: "UNAUTHORIZED" }, { status: 401 })
    }

    const { scheduleId } = params

    // Get schedule from Redis
    const schedule = await redis.get(`schedule:${scheduleId}`)

    if (!schedule) {
      return NextResponse.json({ error: "Schedule not found", code: "NOT_FOUND" }, { status: 404 })
    }

    // Check if user has permission to view this schedule
    // Admins can view all schedules, users can only view their own
    if (session.user.role !== "admin" && schedule.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to view this schedule", code: "FORBIDDEN" }, { status: 403 })
    }

    return NextResponse.json(schedule)
  } catch (error) {
    console.error("Error getting schedule:", error)
    return NextResponse.json({ error: "Internal server error", code: "SERVER_ERROR" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { scheduleId: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Authentication required", code: "UNAUTHORIZED" }, { status: 401 })
    }

    const { scheduleId } = params

    // Get schedule from Redis
    const schedule = await redis.get(`schedule:${scheduleId}`)

    if (!schedule) {
      return NextResponse.json({ error: "Schedule not found", code: "NOT_FOUND" }, { status: 404 })
    }

    // Check if user has permission to delete this schedule
    // Admins can delete all schedules, users can only delete their own
    if (session.user.role !== "admin" && schedule.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to delete this schedule", code: "FORBIDDEN" }, { status: 403 })
    }

    // Update schedule status to deleted
    await redis.set(`schedule:${scheduleId}`, {
      ...schedule,
      status: "deleted",
      deletedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Schedule deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting schedule:", error)
    return NextResponse.json({ error: "Internal server error", code: "SERVER_ERROR" }, { status: 500 })
  }
}
