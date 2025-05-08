import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redis } from "@/lib/redis"

export async function GET(request: NextRequest, { params }: { params: { importId: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Authentication required", code: "UNAUTHORIZED" }, { status: 401 })
    }

    const { importId } = params

    // Get import status from Redis
    const importInfo = await redis.get(`import:${importId}`)

    if (!importInfo) {
      return NextResponse.json({ error: "Import not found", code: "NOT_FOUND" }, { status: 404 })
    }

    // Check if user has permission to view this import
    // Admins can view all imports, users can only view their own
    if (session.user.role !== "admin" && importInfo.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to view this import", code: "FORBIDDEN" }, { status: 403 })
    }

    return NextResponse.json(importInfo)
  } catch (error) {
    console.error("Error getting import status:", error)
    return NextResponse.json({ error: "Internal server error", code: "SERVER_ERROR" }, { status: 500 })
  }
}
