import { Suspense } from "react"
import { AuthLayout } from "@/components/auth/auth-layout"
import VerifyEmailClient from "@/components/auth/verify-email-client"

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token

  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailClient token={token} />
      </Suspense>
    </AuthLayout>
  )
}
