import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import { redis } from "@/lib/redis"
import type { User } from "./types"

// Session interface
interface Session {
  id: string
  userId: string
  email: string
  username: string
  role: string
  isAuthenticated: boolean
  createdAt: string
  expiresAt: string
}

// Session manager
export const sessionManager = {
  // Create a new session
  async createSession(user: User, rememberMe = false): Promise<string> {
    const sessionId = uuidv4()
    const now = new Date()

    // Set expiration time (30 days if remember me, 24 hours otherwise)
    const expiresAt = new Date(now)
    if (rememberMe) {
      expiresAt.setDate(expiresAt.getDate() + 30) // 30 days
    } else {
      expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours
    }

    const session: Session = {
      id: sessionId,
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isAuthenticated: true,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    }

    // Store session in Redis
    await redis.set(`session:${sessionId}`, session, { ex: Math.floor((expiresAt.getTime() - now.getTime()) / 1000) })

    // Set session cookie
    const cookieStore = cookies()
    cookieStore.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    return sessionId
  },

  // Get session by ID
  async getSession(sessionId?: string): Promise<Session | null> {
    try {
      // If no sessionId provided, try to get it from cookies
      if (!sessionId) {
        const cookieStore = cookies()
        sessionId = cookieStore.get("session_id")?.value
      }

      if (!sessionId) {
        return null
      }

      // Get session from Redis
      const session = await redis.get<Session>(`session:${sessionId}`)

      if (!session) {
        return null
      }

      // Check if session is expired
      const expiresAt = new Date(session.expiresAt)
      if (expiresAt < new Date()) {
        await this.destroySession(sessionId)
        return null
      }

      return session
    } catch (error) {
      console.error("Error getting session:", error)
      return null
    }
  },

  // Destroy session
  async destroySession(sessionId?: string): Promise<void> {
    try {
      // If no sessionId provided, try to get it from cookies
      if (!sessionId) {
        const cookieStore = cookies()
        sessionId = cookieStore.get("session_id")?.value
      }

      if (sessionId) {
        // Delete session from Redis
        await redis.del(`session:${sessionId}`)
      }

      // Delete session cookie
      const cookieStore = cookies()
      cookieStore.delete("session_id")
    } catch (error) {
      console.error("Error destroying session:", error)
    }
  },

  // Refresh session
  async refreshSession(sessionId?: string): Promise<string | null> {
    try {
      // Get current session
      const session = await this.getSession(sessionId)

      if (!session) {
        return null
      }

      // Create new session with same data
      const user: User = {
        id: session.userId,
        email: session.email,
        username: session.username,
        role: session.role as "user" | "admin" | "analyst",
        passwordHash: "", // Not needed for session creation
        isVerified: true, // Assume verified since they had a valid session
        createdAt: session.createdAt,
        updatedAt: new Date().toISOString(),
      }

      // Determine if this was a "remember me" session by checking expiration
      const expiresAt = new Date(session.expiresAt)
      const createdAt = new Date(session.createdAt)
      const sessionDuration = expiresAt.getTime() - createdAt.getTime()
      const rememberMe = sessionDuration > 24 * 60 * 60 * 1000 // More than 24 hours

      // Destroy old session
      await this.destroySession(session.id)

      // Create new session
      return this.createSession(user, rememberMe)
    } catch (error) {
      console.error("Error refreshing session:", error)
      return null
    }
  },
}

// Export a compatibility function for getSessionData
export async function getSessionData(sessionId?: string): Promise<Session | null> {
  return sessionManager.getSession(sessionId)
}
