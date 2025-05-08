import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { redis } from "@/lib/redis"
import { hashPassword } from "@/lib/auth/password"
import { verifyPasswordResetToken, consumePasswordResetToken } from "@/lib/auth/email-service"

// Schema for validating the request body
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json()
    const validatedData = resetPasswordSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid request", details: validatedData.error.errors }, { status: 400 })
    }

    const { token, password } = validatedData.data

    // Verify the password reset token
    const { success, email, message } = await verifyPasswordResetToken(token)

    if (!success || !email) {
      return NextResponse.json({ error: message || "Invalid or expired token" }, { status: 400 })
    }

    // Get the user ID from the email
    const userId = await redis.get(`user:email:${email}`)

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get the user data
    const userData = await redis.get(`user:${userId}`)

    if (!userData) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 })
    }

    // Hash the new password
    const passwordHash = await hashPassword(password)

    // Update the user's password
    const updatedUserData = {
      ...userData,
      passwordHash,
      updatedAt: new Date().toISOString(),
    }

    // Save the updated user data
    await redis.set(`user:${userId}`, updatedUserData)

    // Consume the password reset token
    await consumePasswordResetToken(token)

    return NextResponse.json({ success: true, message: "Password has been reset successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error in reset password endpoint:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
