import { getCache, setCache, deleteCache } from "@/lib/redis"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Session types
export interface UserSession {
  id: string
  userId?: string
  username?: string
  email?: string
  isAuthenticated: boolean
  preferences: {
    theme?: "light" | "dark" | "system"
    recentCompanies?: string[]
    favoriteCompanies?: string[]
    dashboardLayout?: string
  }
  lastActive: number
}

// Create a new session
export async function createSession(): Promise<UserSession> {
  const sessionId = uuidv4()
  const session: UserSession = {
    id: sessionId,
    isAuthenticated: false,
    preferences: {
      theme: "system",
      recentCompanies: [],
      favoriteCompanies: [],
      dashboardLayout: "default",
    },
    lastActive: Date.now(),
  }

  // Store session in Redis with 7-day expiration
  await setCache(`session:${sessionId}`, session, 60 * 60 * 24 * 7)

  // Set session cookie
  cookies().set("sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return session
}

// Get current session
export async function getSession(): Promise<UserSession | null> {
  const sessionId = cookies().get("sessionId")?.value

  if (!sessionId) {
    return null
  }

  const session = await getCache<UserSession>(`session:${sessionId}`)

  if (!session) {
    return null
  }

  // Update last active timestamp
  session.lastActive = Date.now()
  await setCache(`session:${sessionId}`, session, 60 * 60 * 24 * 7)

  return session
}

// Update session data
export async function updateSession(updates: Partial<UserSession>): Promise<UserSession | null> {
  const sessionId = cookies().get("sessionId")?.value

  if (!sessionId) {
    return null
  }

  const currentSession = await getCache<UserSession>(`session:${sessionId}`)

  if (!currentSession) {
    return null
  }

  // Merge updates with current session
  const updatedSession = {
    ...currentSession,
    ...updates,
    lastActive: Date.now(),
  }

  // Store updated session
  await setCache(`session:${sessionId}`, updatedSession, 60 * 60 * 24 * 7)

  return updatedSession
}

// End session
export async function endSession(): Promise<void> {
  const sessionId = cookies().get("sessionId")?.value

  if (sessionId) {
    await deleteCache(`session:${sessionId}`)
    cookies().delete("sessionId")
  }
}
