import { NextResponse } from "next/server"
import { sessionManager } from "@/lib/auth/session-manager"

export async function GET() {
  try {
    const session = await sessionManager.getSession()

    if (!session) {
      return NextResponse.json({ isAuthenticated: false, isVerified: false }, { status: 401 })
    }

    return NextResponse.json({
      isAuthenticated: session.isAuthenticated,
      isVerified: session.isVerified,
    })
  } catch (error) {
    console.error("Error verifying session:", error)
    return NextResponse.json({ error: "Failed to verify session" }, { status: 500 })
  }
}
