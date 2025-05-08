"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { verifyEmail, resendVerificationEmailAction } from "@/app/actions/auth-actions"
import { useAuth } from "./auth-context"

export default function VerifyEmailClient({ token }: { token?: string }) {
  const [isVerifying, setIsVerifying] = useState(!!token)
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [resendResult, setResendResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    async function verifyToken() {
      if (token) {
        setIsVerifying(true)
        try {
          console.log(`Client: Verifying token: ${token}`)
          const result = await verifyEmail(token)
          console.log(`Client: Verification result:`, result)

          setVerificationResult({
            success: result.success,
            message: result.message,
          })

          if (result.success) {
            // Redirect to dashboard after successful verification
            console.log("Client: Verification successful, redirecting to dashboard in 3 seconds")
            setTimeout(() => {
              router.push("/dashboard")
            }, 3000)
          }
        } catch (error) {
          console.error("Client: Error during verification:", error)
          setVerificationResult({
            success: false,
            message: "An unexpected error occurred",
          })
        } finally {
          setIsVerifying(false)
        }
      }
    }

    verifyToken()
  }, [token, router])

  const handleResendVerification = async () => {
    setIsResending(true)
    setResendResult(null)

    try {
      const result = await resendVerificationEmailAction()
      setResendResult({
        success: result.success,
        message: result.message,
      })
    } catch (error) {
      setResendResult({
        success: false,
        message: "An unexpected error occurred",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Email Verification</CardTitle>
        <CardDescription>
          {token ? "We're verifying your email address..." : "Please verify your email address to continue"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isVerifying ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : token ? (
          verificationResult && (
            <div
              className={`p-4 rounded-md ${
                verificationResult.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              {verificationResult.message}
              {verificationResult.success && <p className="mt-2">Redirecting to dashboard in a few seconds...</p>}
            </div>
          )
        ) : (
          <div className="space-y-4">
            <p>
              We've sent a verification email to <span className="font-medium">{user?.email}</span>.
            </p>
            <p>Please check your inbox and click the verification link to activate your account.</p>
            {resendResult && (
              <div
                className={`p-4 rounded-md ${
                  resendResult.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}
              >
                {resendResult.message}
              </div>
            )}
          </div>
        )}
      </CardContent>
      {!token && (
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={handleResendVerification} disabled={isResending} className="w-full" variant="outline">
            {isResending ? "Sending..." : "Resend Verification Email"}
          </Button>
          <Button onClick={() => router.push("/login")} className="w-full" variant="ghost">
            Back to Login
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
