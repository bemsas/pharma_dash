import { type NextRequest, NextResponse } from "next/server"
import { processScheduledImports } from "@/lib/services/data-import-service"

// This endpoint will be called by a cron job service (like Vercel Cron)
export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized (in production, use a secret token)
    const authHeader = request.headers.get("authorization")
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Process scheduled imports
    const jobsRun = await processScheduledImports()

    return NextResponse.json({
      success: true,
      message: `Processed ${jobsRun} scheduled imports`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error running cron job:", error)
    return NextResponse.json({ error: "Internal server error", code: "SERVER_ERROR" }, { status: 500 })
  }
}
