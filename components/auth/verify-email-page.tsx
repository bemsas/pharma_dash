"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth/auth-context"
import { verifyEmail } from "@/app/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Mail } from "lucide-react"

export function VerifyEmailPage() {
  const { user, requiresVerification, resendVerificationEmail, isLoading } = useAuth()
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending")
  const [message, setMessage] = useState<string>("")
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    // If user is already verified, redirect to dashboard
    if (user?.isVerified) {
      router.push("/")
      return
    }

    // If there's a token in the URL, verify it
    async function verifyToken() {
      if (token) {
        try {
          const result = await verifyEmail(token)

          if (result.success) {
            setVerificationStatus("success")
            setMessage("Your email has been verified successfully!")

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
              router.push("/")
            }, 3000)
          } else {
            setVerificationStatus("error")
            setMessage(result.message || "Failed to verify email. The link may be invalid or expired.")
          }
        } catch (error) {
          console.error("Error verifying email:", error)
          setVerificationStatus("error")
          setMessage("An unexpected error occurred. Please try again.")
        }
      }
    }

    verifyToken()
  }, [token, user, router])

  const handleResendEmail = async () => {
    setIsResending(true)
    setResendSuccess(false)

    try {
      const success = await resendVerificationEmail()

      if (success) {
        setResendSuccess(true)
        setMessage("Verification email sent successfully. Please check your inbox.")
      } else {
        setResendSuccess(false)
        setMessage("Failed to send verification email. Please try again.")
      }
    } catch (error) {
      console.error("Error resending verification email:", error)
      setResendSuccess(false)
      setMessage("An unexpected error occurred. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  // If no token is provided, show the verification pending page
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>
              We've sent a verification email to {user?.email}. Please check your inbox and click the verification link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resendSuccess && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Verification email sent successfully!</AlertDescription>
              </Alert>
            )}

            {message && !resendSuccess && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <p className="text-sm text-gray-500 mb-4">
              If you don't see the email in your inbox, please check your spam folder. The verification link will expire
              after 24 hours.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button onClick={handleResendEmail} disabled={isResending} className="w-full">
              {isResending ? "Sending..." : "Resend verification email"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/login")} className="w-full">
              Back to login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // If token is provided, show the verification status
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
            {verificationStatus === "success" ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : verificationStatus === "error" ? (
              <AlertCircle className="h-6 w-6 text-red-600" />
            ) : (
              <Mail className="h-6 w-6 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {verificationStatus === "success"
              ? "Email Verified!"
              : verificationStatus === "error"
                ? "Verification Failed"
                : "Verifying Email..."}
          </CardTitle>
          <CardDescription>{message || "We're verifying your email address..."}</CardDescription>
        </CardHeader>
        <CardContent>
          {verificationStatus === "success" && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Your email has been verified successfully!</AlertDescription>
            </Alert>
          )}

          {verificationStatus === "error" && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          {verificationStatus === "success" && (
            <Button onClick={() => router.push("/")} className="w-full">
              Go to Dashboard
            </Button>
          )}

          {verificationStatus === "error" && (
            <div className="flex flex-col gap-4 w-full">
              <Button onClick={handleResendEmail} disabled={isResending} className="w-full">
                {isResending ? "Sending..." : "Resend verification email"}
              </Button>
              <Button variant="outline" onClick={() => router.push("/login")} className="w-full">
                Back to login
              </Button>
            </div>
          )}

          {verificationStatus === "pending" && (
            <div className="w-full flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
