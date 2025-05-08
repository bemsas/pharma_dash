"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function EmailTestPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/test-email?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send test email")
      }

      setResult({
        success: true,
        message: data.message || "Test email sent successfully",
      })
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Email Testing Tool</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Test Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Test Email"}
          </button>
        </form>

        {result && (
          <div
            className={`mt-4 p-4 rounded-md ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
          >
            {result.success ? result.message : result.error}
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Instructions</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>Enter an email address where you want to receive the test email</li>
            <li>Click "Send Test Email" to send a test message</li>
            <li>Check your inbox (and spam folder) for the test email</li>
            <li>If you don't receive the email, check the console logs for errors</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
