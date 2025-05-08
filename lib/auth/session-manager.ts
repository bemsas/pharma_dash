import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import { redis } from "@/lib/redis"
import type { AuthSession, User } from "@/lib/auth/types"

// Session durations in seconds
const SESSION_DURATIONS = {
  // Standard session duration: 1 day
  STANDARD: 60 * 60 * 24,
  // Extended session duration for "Remember me": 30 days
  EXTENDED: 60 * 60 * 24 * 30,
}

export const sessionManager = {
  // Create a new authenticated session
  async createSession(user: User, rememberMe = false): Promise<string> {
    const sessionId = uuidv4()
    const sessionDuration = rememberMe ? SESSION_DURATIONS.EXTENDED : SESSION_DURATIONS.STANDARD
    const expiresAt = Date.now() + sessionDuration * 1000

    const session: AuthSession = {
      userId: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      isAuthenticated: true,
      isVerified: user.isVerified,
      expiresAt,
    }

    // Store session in Redis
    await redis.set(`session:${sessionId}`, session, { ex: sessionDuration })

    // Set session cookie
    cookies().set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionDuration,
      path: "/",
      sameSite: "lax",
    })

    return sessionId
  },

  // Get current session
  async getSession(): Promise<AuthSession | null> {
    const sessionId = cookies().get("sessionId")?.value

    if (!sessionId) {
      return null
    }

    try {
      const session = await redis.get<AuthSession>(`session:${sessionId}`)

      if (!session) {
        return null
      }

      // Check if session has expired
      if (session.expiresAt < Date.now()) {
        await this.destroySession()
        return null
      }

      return session
    } catch (error) {
      console.error("Error getting session:", error)
      return null
    }
  },

  // Destroy the current session
  async destroySession(): Promise<void> {
    const sessionId = cookies().get("sessionId")?.value

    if (sessionId) {
      // Remove session from Redis
      await redis.del(`session:${sessionId}`)

      // Clear session cookie
      cookies().delete("sessionId")
    }
  },

  // Refresh the session expiration
  async refreshSession(): Promise<void> {
    const sessionId = cookies().get("sessionId")?.value

    if (!sessionId) {
      return
    }

    try {
      const session = await redis.get<AuthSession>(`session:${sessionId}`)

      if (!session) {
        return
      }

      // Determine if this is a long-term session by checking the original duration
      const isLongTermSession = session.expiresAt - Date.now() > SESSION_DURATIONS.STANDARD * 1000
      const sessionDuration = isLongTermSession ? SESSION_DURATIONS.EXTENDED : SESSION_DURATIONS.STANDARD

      // Update expiration time
      session.expiresAt = Date.now() + sessionDuration * 1000

      // Store updated session
      await redis.set(`session:${sessionId}`, session, { ex: sessionDuration })

      // Update cookie expiration
      cookies().set("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: sessionDuration,
        path: "/",
        sameSite: "lax",
      })
    } catch (error) {
      console.error("Error refreshing session:", error)
    }
  },
}
