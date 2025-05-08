"use server"

import { v4 as uuidv4 } from "uuid"
import { redis } from "@/lib/redis"
import type { VerificationToken } from "./types"

// In a real application, you would use a proper email service like SendGrid, Mailgun, etc.
// For this demo, we'll just simulate sending emails by storing tokens in Redis

export async function sendVerificationEmail(userId: string, email: string): Promise<string> {
  try {
    // Generate a verification token
    const token = uuidv4()
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now

    // Store the token in Redis
    const verificationToken: VerificationToken = {
      userId,
      token,
      expiresAt,
    }

    await redis.set(`verification:${token}`, verificationToken, { ex: 86400 }) // 24 hours expiry

    // Create verification URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email?token=${token}`

    // In a real application, you would send an actual email here
    console.log(`Verification email sent to ${email}:`)
    console.log(`Verification URL: ${verificationUrl}`)

    // For demo purposes, we'll return the token so we can use it
    return token
  } catch (error) {
    console.error("Error sending verification email:", error)
    throw new Error("Failed to send verification email")
  }
}

export async function verifyEmailToken(token: string): Promise<{ success: boolean; userId?: string; message: string }> {
  try {
    // Get the verification token from Redis
    const verificationToken = await redis.get<VerificationToken>(`verification:${token}`)

    if (!verificationToken) {
      return { success: false, message: "Invalid or expired verification token" }
    }

    // Check if the token has expired
    if (verificationToken.expiresAt < Date.now()) {
      await redis.del(`verification:${token}`)
      return { success: false, message: "Verification token has expired" }
    }

    // Delete the token from Redis (one-time use)
    await redis.del(`verification:${token}`)

    return {
      success: true,
      userId: verificationToken.userId,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("Error verifying email token:", error)
    return { success: false, message: "Failed to verify email" }
  }
}

export async function resendVerificationEmail(userId: string, email: string): Promise<boolean> {
  try {
    // Delete any existing verification tokens for this user
    const existingTokens = await redis.keys(`verification:*`)

    for (const key of existingTokens) {
      const token = await redis.get<VerificationToken>(key)
      if (token && token.userId === userId) {
        await redis.del(key)
      }
    }

    // Send a new verification email
    await sendVerificationEmail(userId, email)
    return true
  } catch (error) {
    console.error("Error resending verification email:", error)
    return false
  }
}
