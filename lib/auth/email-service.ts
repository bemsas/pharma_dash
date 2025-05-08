import { Resend } from "resend"
import { v4 as uuidv4 } from "uuid"
import { redis } from "@/lib/redis"

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Token expiration time (24 hours in seconds)
const TOKEN_EXPIRATION = 60 * 60 * 24

// Generate a verification token
export function generateVerificationToken(): string {
  return uuidv4()
}

// Send verification email using Resend
export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  try {
    // Store the token in Redis with the user's email
    await redis.set(`verification:${token}`, email, { ex: TOKEN_EXPIRATION })

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Pharma Dashboard <notifications@neurointel.io>", // Replace with your verified domain
      to: [email],
      subject: "Verify your email address",
      html: getVerificationEmailTemplate(verificationUrl),
    })

    if (error) {
      console.error("Email verification sending failed:", error)
      return false
    }

    console.log("Verification email sent successfully:", data)
    return true
  } catch (error) {
    console.error("Error sending verification email:", error)
    return false
  }
}

// Verify email token
export async function verifyEmailToken(
  token: string,
): Promise<{ success: boolean; userId?: string; message?: string }> {
  try {
    // Get the email associated with the token
    const email = await redis.get<string>(`verification:${token}`)

    if (!email) {
      return {
        success: false,
        message: "Invalid or expired verification token",
      }
    }

    // Delete the token from Redis
    await redis.del(`verification:${token}`)

    return {
      success: true,
      userId: email, // In a real implementation, you would look up the user ID by email
    }
  } catch (error) {
    console.error("Error verifying email token:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

// Resend verification email
export async function resendVerificationEmail(userId: string, email: string): Promise<boolean> {
  try {
    // Generate a new verification token
    const token = generateVerificationToken()

    // Store the token in Redis with the user's email
    await redis.set(`verification:${token}`, email, { ex: TOKEN_EXPIRATION })

    // Send email using Resend
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
    const { data, error } = await resend.emails.send({
      from: "Pharma Dashboard <notifications@neurointel.io>", // Replace with your verified domain
      to: [email],
      subject: "Verify your email address",
      html: getVerificationEmailTemplate(verificationUrl, true),
    })

    if (error) {
      console.error("Email verification resending failed:", error)
      return false
    }

    console.log("Verification email resent successfully:", data)
    return true
  } catch (error) {
    console.error("Error resending verification email:", error)
    return false
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  try {
    // Store the token in Redis with the user's email
    await redis.set(`password-reset:${token}`, email, { ex: TOKEN_EXPIRATION })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Pharma Dashboard <notifications@neurointel.io>", // Replace with your verified domain
      to: [email],
      subject: "Reset your password",
      html: getPasswordResetEmailTemplate(resetUrl),
    })

    if (error) {
      console.error("Password reset email sending failed:", error)
      return false
    }

    console.log("Password reset email sent successfully:", data)
    return true
  } catch (error) {
    console.error("Error sending password reset email:", error)
    return false
  }
}

// Verify password reset token
export async function verifyPasswordResetToken(
  token: string,
): Promise<{ success: boolean; email?: string; message?: string }> {
  try {
    // Get the email associated with the token
    const email = await redis.get<string>(`password-reset:${token}`)

    if (!email) {
      return {
        success: false,
        message: "Invalid or expired password reset token",
      }
    }

    return {
      success: true,
      email,
    }
  } catch (error) {
    console.error("Error verifying password reset token:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

// Consume password reset token (call after password has been reset)
export async function consumePasswordResetToken(token: string): Promise<boolean> {
  try {
    await redis.del(`password-reset:${token}`)
    return true
  } catch (error) {
    console.error("Error consuming password reset token:", error)
    return false
  }
}

// Email Templates
function getVerificationEmailTemplate(verificationUrl: string, isResend = false): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          border: 1px solid #e1e1e1;
          border-radius: 5px;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          text-align: center;
          padding-bottom: 10px;
          border-bottom: 1px solid #e1e1e1;
          margin-bottom: 20px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }
        .button {
          display: inline-block;
          background-color: #2563eb;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Pharma Dashboard</div>
        </div>
        
        <h2>Email Verification</h2>
        
        <p>Thank you for registering with Pharma Dashboard. ${isResend ? "You requested a new verification link. " : ""}Please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center;">
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
        </div>
        
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        
        <p style="word-break: break-all;">${verificationUrl}</p>
        
        <p>This link will expire in 24 hours.</p>
        
        <p>If you didn't create an account with us, you can safely ignore this email.</p>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Pharma Dashboard. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function getPasswordResetEmailTemplate(resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          border: 1px solid #e1e1e1;
          border-radius: 5px;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          text-align: center;
          padding-bottom: 10px;
          border-bottom: 1px solid #e1e1e1;
          margin-bottom: 20px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }
        .button {
          display: inline-block;
          background-color: #2563eb;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Pharma Dashboard</div>
        </div>
        
        <h2>Password Reset Request</h2>
        
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </div>
        
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        
        <p style="word-break: break-all;">${resetUrl}</p>
        
        <p>This link will expire in 24 hours.</p>
        
        <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Pharma Dashboard. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
