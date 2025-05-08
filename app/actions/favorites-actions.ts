"use server"

import { getSession, updateSession } from "@/lib/session"

// Get user favorites
export async function getUserFavorites(): Promise<string[]> {
  try {
    const session = await getSession()

    if (!session || !session.isAuthenticated) {
      return []
    }

    return session.preferences.favoriteCompanies || []
  } catch (error) {
    console.error("Error getting user favorites:", error)
    return []
  }
}

// Add company to favorites
export async function addToFavorites(company: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getSession()

    if (!session || !session.isAuthenticated) {
      return {
        success: false,
        message: "You must be logged in to add favorites",
      }
    }

    const currentFavorites = session.preferences.favoriteCompanies || []

    // Check if company is already in favorites
    if (currentFavorites.includes(company)) {
      return {
        success: true,
        message: "Company is already in your favorites",
      }
    }

    // Add company to favorites
    const updatedFavorites = [...currentFavorites, company]

    // Update session
    await updateSession({
      preferences: {
        ...session.preferences,
        favoriteCompanies: updatedFavorites,
      },
    })

    return {
      success: true,
      message: "Company added to favorites",
    }
  } catch (error) {
    console.error("Error adding to favorites:", error)
    return {
      success: false,
      message: "Failed to add company to favorites",
    }
  }
}

// Remove company from favorites
export async function removeFromFavorites(company: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getSession()

    if (!session || !session.isAuthenticated) {
      return {
        success: false,
        message: "You must be logged in to remove favorites",
      }
    }

    const currentFavorites = session.preferences.favoriteCompanies || []

    // Check if company is in favorites
    if (!currentFavorites.includes(company)) {
      return {
        success: true,
        message: "Company is not in your favorites",
      }
    }

    // Remove company from favorites
    const updatedFavorites = currentFavorites.filter((c) => c !== company)

    // Update session
    await updateSession({
      preferences: {
        ...session.preferences,
        favoriteCompanies: updatedFavorites,
      },
    })

    return {
      success: true,
      message: "Company removed from favorites",
    }
  } catch (error) {
    console.error("Error removing from favorites:", error)
    return {
      success: false,
      message: "Failed to remove company from favorites",
    }
  }
}

export async function toggleFavorite(
  company: string,
): Promise<{ success: boolean; message: string; isFavorite: boolean }> {
  const currentFavorites = await getUserFavorites()
  const isCurrentlyFavorite = currentFavorites.includes(company)

  if (isCurrentlyFavorite) {
    const result = await removeFromFavorites(company)
    return { ...result, isFavorite: false }
  } else {
    const result = await addToFavorites(company)
    return { ...result, isFavorite: true }
  }
}
