import { NextResponse } from "next/server"
import { sessionManager } from "@/lib/auth/session-manager"
import { getUserById } from "@/lib/auth/user-repository"

export async function GET() {
  try {
    const session = await sessionManager.getSession()

    if (!session || !session.isAuthenticated) {
      // Return a 200 status with null user instead of 401
      // This prevents showing an error on the login page for unauthenticated users
      return NextResponse.json({ user: null })
    }

    const user = await getUserById(session.userId)

    if (!user) {
      // Return a 200 status with null user instead of 404
      return NextResponse.json({ user: null })
    }

    // Return user without sensitive information
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error("Error getting current user:", error)
    // Return a 200 status with null user instead of 500
    return NextResponse.json({ user: null })
  }
}
