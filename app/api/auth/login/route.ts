import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth/user-repository"
import { sessionManager } from "@/lib/auth/session-manager"

export async function POST(request: NextRequest) {
  try {
    console.log("Processing login request")

    // Parse request body
    const body = await request.json()
    const { emailOrUsername, password, rememberMe } = body

    // Validate input
    if (!emailOrUsername || !password) {
      return NextResponse.json({ success: false, message: "Email/username and password are required" }, { status: 400 })
    }

    // Authenticate user
    const user = await authenticateUser({ emailOrUsername, password })

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          requiresVerification: true,
          message: "Email verification required",
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            isVerified: user.isVerified,
          },
        },
        { status: 403 },
      )
    }

    // Create session
    const sessionId = await sessionManager.createSession(user, rememberMe)

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during login" }, { status: 500 })
  }
}
