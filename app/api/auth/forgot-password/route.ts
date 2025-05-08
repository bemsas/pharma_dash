import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { redis } from "@/lib/redis"
import { sendPasswordResetEmail } from "@/lib/auth/email-service"
import { v4 as uuidv4 } from "uuid"

// Schema for validating the request body
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json()
    const validatedData = forgotPasswordSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid request", details: validatedData.error.errors }, { status: 400 })
    }

    const { email } = validatedData.data

    // Check if the user exists
    const userId = await redis.get(`user:email:${email}`)

    // Even if the user doesn't exist, we'll return a success response
    // This prevents email enumeration attacks
    if (!userId) {
      console.log(`Password reset requested for non-existent email: ${email}`)
      return NextResponse.json(
        { success: true, message: "If your email exists in our system, you will receive a password reset link" },
        { status: 200 },
      )
    }

    // Generate a password reset token
    const token = uuidv4()

    // Send the password reset email
    const emailSent = await sendPasswordResetEmail(email, token)

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send password reset email" }, { status: 500 })
    }

    return NextResponse.json(
      { success: true, message: "If your email exists in our system, you will receive a password reset link" },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in forgot password endpoint:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
