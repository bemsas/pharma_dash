"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Validate the email
      const validatedData = forgotPasswordSchema.parse({ email })

      // Send the request to the API
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: validatedData.email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      // Show success message
      setSuccess(true)
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
        <p className="mt-2 text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
      </div>

      {success ? (
        <div className="text-center">
          <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md">
            If your email exists in our system, you will receive a password reset link shortly.
          </div>
          <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Return to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
              Back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
