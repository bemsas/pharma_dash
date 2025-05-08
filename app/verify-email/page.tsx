import { Suspense } from "react"
import { VerifyEmailWrapper } from "@/components/auth/verify-email-wrapper"

export default function VerifyEmail() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailWrapper />
    </Suspense>
  )
}

function VerifyEmailFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">Loading verification page...</h2>
        <p className="text-center text-gray-600">Please wait while we prepare your verification page.</p>
      </div>
    </div>
  )
}
