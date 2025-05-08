"use server"

import { kv } from "@vercel/kv"
import { getSessionData } from "@/lib/auth/session-manager"

// Get user favorites
export async function getUserFavorites(): Promise<string[]> {
  try {
    // Temporarily bypass authentication check
    // Return empty array if no session is found
    const session = await getSessionData()
    if (!session || !session.userId) {
      console.log("No valid session found, returning empty favorites array")
      return []
    }

    const userId = session.userId
    const favorites = await kv.smembers<string[]>(`user:${userId}:favorites`)
    return favorites || []
  } catch (error) {
    console.error("Error fetching user favorites:", error)
    return []
  }
}

// Toggle company in favorites
export async function toggleFavorite(companyId: string): Promise<{ success: boolean; isFavorite: boolean }> {
  try {
    // Temporarily bypass authentication check
    // Return success even if no session is found
    const session = await getSessionData()
    if (!session || !session.userId) {
      console.log("No valid session found, cannot toggle favorites")
      return { success: false, isFavorite: false }
    }

    const userId = session.userId
    const isMember = await kv.sismember(`user:${userId}:favorites`, companyId)

    if (isMember) {
      await kv.srem(`user:${userId}:favorites`, companyId)
      return { success: true, isFavorite: false }
    } else {
      await kv.sadd(`user:${userId}:favorites`, companyId)
      return { success: true, isFavorite: true }
    }
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return { success: false, isFavorite: false }
  }
}

// Add company to favorites
export async function addToFavorites(companyId: string): Promise<boolean> {
  try {
    // Temporarily bypass authentication check
    // Return success even if no session is found
    const session = await getSessionData()
    if (!session || !session.userId) {
      console.log("No valid session found, cannot add to favorites")
      return false
    }

    const userId = session.userId
    await kv.sadd(`user:${userId}:favorites`, companyId)
    return true
  } catch (error) {
    console.error("Error adding to favorites:", error)
    return false
  }
}

// Remove company from favorites
export async function removeFromFavorites(companyId: string): Promise<boolean> {
  try {
    // Temporarily bypass authentication check
    // Return success even if no session is found
    const session = await getSessionData()
    if (!session || !session.userId) {
      console.log("No valid session found, cannot remove from favorites")
      return false
    }

    const userId = session.userId
    await kv.srem(`user:${userId}:favorites`, companyId)
    return true
  } catch (error) {
    console.error("Error removing from favorites:", error)
    return false
  }
}

// Check if company is in favorites
export async function isInFavorites(companyId: string): Promise<boolean> {
  try {
    // Temporarily bypass authentication check
    // Return false if no session is found
    const session = await getSessionData()
    if (!session || !session.userId) {
      console.log("No valid session found, returning false for isInFavorites")
      return false
    }

    const userId = session.userId
    const isMember = await kv.sismember(`user:${userId}:favorites`, companyId)
    return !!isMember
  } catch (error) {
    console.error("Error checking if in favorites:", error)
    return false
  }
}
