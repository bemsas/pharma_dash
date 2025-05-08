"use server"

import { userRepository } from "@/lib/auth/user-repository"
import { sessionManager } from "@/lib/auth/session-manager"
import { verifyEmailToken, resendVerificationEmail } from "@/lib/auth/email-service"
import type { RegisterData, UserCredentials, AuthResult } from "@/lib/auth/types"
import { revalidatePath } from "next/cache"

// Register a new user
export async function registerUser(data: RegisterData): Promise<AuthResult> {
  // Validate input
  if (!data.email || !data.username || !data.password) {
    return { success: false, message: "All fields are required" }
  }

  if (data.password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters" }
  }

  // Create user
  const result = await userRepository.createUser(data)

  // If registration successful, create session
  if (result.success && result.user) {
    await sessionManager.createSession(result.user)
    revalidatePath("/")
  }

  return result
}

// Login user
export async function loginUser(credentials: UserCredentials, rememberMe = false): Promise<AuthResult> {
  // Validate input
  if (!credentials.email || !credentials.password) {
    return { success: false, message: "Email and password are required" }
  }

  // Verify credentials
  const result = await userRepository.verifyCredentials(credentials)

  // If login successful, create session
  if (result.success && result.user) {
    // Only create a session if the user is verified or we're redirecting to verification
    await sessionManager.createSession(result.user, rememberMe)
    revalidatePath("/")
  }

  return result
}

// Logout user
export async function logoutUser(): Promise<{ success: boolean }> {
  try {
    await sessionManager.destroySession()
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error logging out:", error)
    return { success: false }
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const session = await sessionManager.getSession()

    if (!session || !session.isAuthenticated) {
      return null
    }

    // Refresh session to extend expiration
    await sessionManager.refreshSession()

    return {
      id: session.userId,
      username: session.username,
      email: session.email,
      name: session.name,
      role: session.role,
      isVerified: session.isVerified,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(updates: { name?: string }): Promise<AuthResult> {
  try {
    const session = await sessionManager.getSession()

    if (!session || !session.isAuthenticated) {
      return { success: false, message: "Not authenticated" }
    }

    const result = await userRepository.updateUser(session.userId, updates)

    if (result.success) {
      // Refresh session with updated data
      if (result.user) {
        await sessionManager.createSession(result.user)
      }
      revalidatePath("/settings")
    }

    return result
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, message: "Failed to update profile" }
  }
}

// Change password
export async function changePassword(currentPassword: string, newPassword: string): Promise<AuthResult> {
  try {
    const session = await sessionManager.getSession()

    if (!session || !session.isAuthenticated) {
      return { success: false, message: "Not authenticated" }
    }

    if (newPassword.length < 8) {
      return { success: false, message: "New password must be at least 8 characters" }
    }

    const result = await userRepository.changePassword(session.userId, currentPassword, newPassword)

    if (result.success) {
      revalidatePath("/settings")
    }

    return result
  } catch (error) {
    console.error("Error changing password:", error)
    return { success: false, message: "Failed to change password" }
  }
}

// Verify email with token
export async function verifyEmail(token: string): Promise<AuthResult> {
  try {
    const result = await verifyEmailToken(token)

    if (!result.success || !result.userId) {
      return { success: false, message: result.message }
    }

    // Update user's verification status
    const verifyResult = await userRepository.verifyEmail(result.userId)

    if (verifyResult.success && verifyResult.user) {
      // Update session with verified status
      await sessionManager.createSession(verifyResult.user)
      revalidatePath("/")
    }

    return verifyResult
  } catch (error) {
    console.error("Error verifying email:", error)
    return { success: false, message: "Failed to verify email" }
  }
}

// Resend verification email
export async function resendVerificationEmailAction(): Promise<AuthResult> {
  try {
    const session = await sessionManager.getSession()

    if (!session || !session.isAuthenticated) {
      return { success: false, message: "Not authenticated" }
    }

    // Get user data
    const user = await userRepository.getUserById(session.userId)

    if (!user) {
      return { success: false, message: "User not found" }
    }

    if (user.isVerified) {
      return { success: false, message: "Email is already verified" }
    }

    const success = await resendVerificationEmail(user.id, user.email)

    if (success) {
      return { success: true, message: "Verification email sent successfully" }
    } else {
      return { success: false, message: "Failed to send verification email" }
    }
  } catch (error) {
    console.error("Error resending verification email:", error)
    return { success: false, message: "Failed to resend verification email" }
  }
}
