import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import { redis } from "@/lib/redis"
import type { User } from "./types"

// Session expiration times
const SESSION_EXPIRATION = 60 * 60 * 24 * 7 // 7 days in seconds
const REMEMBER_ME_EXPIRATION = 60 * 60 * 24 * 30 // 30 days in seconds

// Session interface
interface Session {
  id: string
  userId: string
  email?: string
  username?: string
  role?: string
  isAuthenticated: boolean
  createdAt: string
  expiresAt: string
}

// Session manager
export const sessionManager = {
  // Create a new session
  async createSession(user: User, rememberMe = false): Promise<string> {
    try {
      console.log(`Creating session for user: ${user.id}`)

      // Generate session ID
      const sessionId = uuidv4()

      // Calculate expiration time
      const expirationTime = rememberMe ? REMEMBER_ME_EXPIRATION : SESSION_EXPIRATION
      const expiresAt = new Date(Date.now() + expirationTime * 1000).toISOString()

      // Create session object
      const session: Session = {
        id: sessionId,
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isAuthenticated: true,
        createdAt: new Date().toISOString(),
        expiresAt,
      }

      // Store session in Redis
      await redis.set(`session:${sessionId}`, session, { ex: expirationTime })

      // Set session cookie
      const cookieStore = cookies()
      cookieStore.set("session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: expirationTime,
        path: "/",
      })

      console.log(`Session created: ${sessionId.substring(0, 8)}...`)
      return sessionId
    } catch (error) {
      console.error("Error creating session:", error)
      throw error
    }
  },

  // Get session by ID
  async getSession(sessionId?: string): Promise<Session | null> {
    try {
      // If no session ID provided, get it from cookies
      if (!sessionId) {
        const cookieStore = cookies()
        sessionId = cookieStore.get("session_id")?.value
      }

      if (!sessionId) {
        console.log("No session ID found")
        return null
      }

      console.log(`Getting session: ${sessionId.substring(0, 8)}...`)

      // Get session from Redis
      const session = await redis.get<Session>(`session:${sessionId}`)

      if (!session) {
        console.log(`Session not found: ${sessionId.substring(0, 8)}...`)
        return null
      }

      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        console.log(`Session expired: ${sessionId.substring(0, 8)}...`)
        await this.destroySession(sessionId)
        return null
      }

      console.log(`Session found: ${sessionId.substring(0, 8)}...`)
      return session
    } catch (error) {
      console.error("Error getting session:", error)
      return null
    }
  },

  // Destroy session
  async destroySession(sessionId?: string): Promise<void> {
    try {
      // If no session ID provided, get it from cookies
      if (!sessionId) {
        const cookieStore = cookies()
        sessionId = cookieStore.get("session_id")?.value
      }

      if (!sessionId) {
        return
      }

      console.log(`Destroying session: ${sessionId.substring(0, 8)}...`)

      // Delete session from Redis
      await redis.del(`session:${sessionId}`)

      // Delete session cookie
      const cookieStore = cookies()
      cookieStore.delete("session_id")

      console.log(`Session destroyed: ${sessionId.substring(0, 8)}...`)
    } catch (error) {
      console.error("Error destroying session:", error)
      throw error
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
        email: session.email || "",
        username: session.username || "",
        role: (session.role as "user" | "admin" | "analyst") || "user",
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

// Export a compatibility function for getSessionData - ADDED TO FIX DEPLOYMENT ERROR
export async function getSessionData(sessionId?: string): Promise<Session | null> {
  return sessionManager.getSession(sessionId)
}
