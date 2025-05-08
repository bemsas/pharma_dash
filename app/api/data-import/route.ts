import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { redis } from "@/lib/redis"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Define validation schema for import request
const importRequestSchema = z.object({
  type: z.enum(["companies", "financials", "news", "pipeline"]),
  source: z.string().optional(),
  data: z.array(z.record(z.any())),
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
    const validationResult = importRequestSchema.safeParse(body)

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

    const { type, source, data } = validationResult.data

    // Generate import ID
    const importId = uuidv4()

    // Store import metadata
    await redis.set(
      `import:${importId}`,
      {
        importId,
        type,
        source: source || "manual",
        status: "pending",
        progress: 0,
        recordsTotal: data.length,
        recordsProcessed: 0,
        recordsFailed: 0,
        startTime: new Date().toISOString(),
        userId: session.user.id,
      },
      { ex: 86400 }, // Expire after 24 hours
    )

    // Store import data
    await redis.set(`import:${importId}:data`, data, { ex: 86400 })

    // Trigger background processing (in a real app, this would be a queue job)
    // For demo purposes, we'll simulate processing with a timeout
    setTimeout(() => processImport(importId), 100)

    return NextResponse.json({
      success: true,
      message: "Data import started",
      importId,
      recordsTotal: data.length,
    })
  } catch (error) {
    console.error("Error processing import request:", error)
    return NextResponse.json({ error: "Internal server error", code: "SERVER_ERROR" }, { status: 500 })
  }
}

// Helper function to process the import (would be a background job in production)
async function processImport(importId: string) {
  try {
    // Get import metadata
    const importInfo = await redis.get(`import:${importId}`)
    if (!importInfo) return

    // Get import data
    const data = await redis.get(`import:${importId}:data`)
    if (!data || !Array.isArray(data)) return

    // Update status to processing
    await redis.set(
      `import:${importId}`,
      {
        ...importInfo,
        status: "processing",
      },
      { ex: 86400 },
    )

    // Process each record
    let recordsProcessed = 0
    let recordsFailed = 0

    for (let i = 0; i < data.length; i++) {
      try {
        // Simulate processing each record
        await new Promise((resolve) => setTimeout(resolve, 50))

        // In a real app, this would process and store the data
        // For demo purposes, we'll just increment the counter
        recordsProcessed++

        // Update progress every 10 records
        if (i % 10 === 0 || i === data.length - 1) {
          const progress = Math.round(((i + 1) / data.length) * 100)
          await redis.set(
            `import:${importId}`,
            {
              ...importInfo,
              status: "processing",
              progress,
              recordsProcessed,
              recordsFailed,
            },
            { ex: 86400 },
          )
        }
      } catch (error) {
        recordsFailed++
      }
    }

    // Update status to completed
    await redis.set(
      `import:${importId}`,
      {
        ...importInfo,
        status: "completed",
        progress: 100,
        recordsProcessed,
        recordsFailed,
        endTime: new Date().toISOString(),
      },
      { ex: 86400 },
    )

    // Clean up data
    await redis.del(`import:${importId}:data`)
  } catch (error) {
    console.error("Error processing import:", error)
    // Update status to failed
    const importInfo = await redis.get(`import:${importId}`)
    if (importInfo) {
      await redis.set(
        `import:${importId}`,
        {
          ...importInfo,
          status: "failed",
          error: "Internal server error during processing",
          endTime: new Date().toISOString(),
        },
        { ex: 86400 },
      )
    }
  }
}
