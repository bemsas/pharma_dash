"use client"

import { AuthProvider } from "@/components/auth/auth-context"
import { VerifyEmailPage } from "@/components/auth/verify-email-page"

export function VerifyEmailWrapper() {
  return (
    <AuthProvider>
      <VerifyEmailPage />
    </AuthProvider>
  )
}
