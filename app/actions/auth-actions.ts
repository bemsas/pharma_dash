"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  getUserById,
  updateUserVerification,
  updateUser as updateUserRepo,
} from "@/lib/auth/user-repository"
import { sessionManager } from "@/lib/auth/session-manager"
import { verifyPassword, hashPassword } from "@/lib/auth/password"
import { generateVerificationToken, sendVerificationEmail } from "@/lib/auth/email-service"
import type { RegisterData, UserCredentials } from "@/lib/auth/types"

// Get current user from session
export async function getCurrentUser() {
  try {
    const session = await sessionManager.getSession()

    if (!session || !session.isAuthenticated) {
      return null
    }

    const user = await getUserById(session.userId)
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Login user
export async function loginUser(credentials: UserCredentials, rememberMe = false) {
  try {
    // Validate credentials
    const validatedCredentials = z
      .object({
        email: z.string().email(),
        password: z.string().min(8),
      })
      .safeParse(credentials)

    if (!validatedCredentials.success) {
      return {
        success: false,
        message: "Invalid credentials format",
      }
    }

    // Find user by email
    const user = await findUserByEmail(credentials.email)

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    // Check if user is verified
    if (!user.isVerified) {
      return {
        success: false,
        message: "Please verify your email before logging in",
        requiresVerification: true,
        user,
      }
    }

    // Verify password
    const passwordMatch = await verifyPassword(credentials.password, user.passwordHash)

    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    // Create session
    await sessionManager.createSession(user, rememberMe)

    return {
      success: true,
      message: "Login successful",
      user,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

// Register user
export async function registerUser(data: RegisterData) {
  try {
    // Validate registration data
    const validatedData = z
      .object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(2),
        subscribeToNews: z.boolean().optional(),
      })
      .safeParse(data)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid registration data",
      }
    }

    // Check if email already exists
    const existingUserByEmail = await findUserByEmail(data.email)

    if (existingUserByEmail) {
      return {
        success: false,
        message: "Email already in use",
      }
    }

    // Generate username from email
    const username = data.email.split("@")[0]

    // Check if username already exists
    const existingUserByUsername = await findUserByUsername(username)

    if (existingUserByUsername) {
      // Generate a unique username by adding a random number
      const uniqueUsername = `${username}${Math.floor(Math.random() * 1000)}`
      data.username = uniqueUsername
    } else {
      data.username = username
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Create user with verification token
    const verificationToken = generateVerificationToken()
    const user = await createUser({
      ...data,
      passwordHash,
      isVerified: false,
      verificationToken,
    })

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken)

    // Create session
    await sessionManager.createSession(user, false)

    return {
      success: true,
      message: "Registration successful",
      requiresVerification: true,
      user,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

// Logout user
export async function logoutUser() {
  try {
    await sessionManager.destroySession()
    redirect("/login")
  } catch (error) {
    console.error("Logout error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

// Verify email
export async function verifyEmail(token: string) {
  try {
    // Update user verification status
    const user = await updateUserVerification(token)

    if (!user) {
      return {
        success: false,
        message: "Invalid or expired verification token",
      }
    }

    return {
      success: true,
      message: "Email verified successfully",
      user,
    }
  } catch (error) {
    console.error("Email verification error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

// Resend verification email
export async function resendVerificationEmailAction() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    if (user.isVerified) {
      return {
        success: false,
        message: "Email already verified",
      }
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken()

    // Update user with new verification token
    await updateUserVerification(verificationToken, user.id)

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken)

    return {
      success: true,
      message: "Verification email sent successfully",
    }
  } catch (error) {
    console.error("Error resending verification email:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

// Update user profile
export async function updateUserProfile(updates: { name: string }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    const result = await updateUserRepo(user.id, updates)

    if (!result.success) {
      return result
    }

    return {
      success: true,
      message: "Profile updated successfully",
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

// Change password
export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    const result = await updateUserRepo.changePassword(user.id, currentPassword, newPassword)
    return result
  } catch (error) {
    console.error("Error changing password:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}
