import { Suspense } from "react"
import { RegisterPageClient } from "@/components/auth/register-page-client"

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <RegisterPageClient />
    </Suspense>
  )
}
