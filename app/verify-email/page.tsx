import { Suspense } from "react"
import { redirect } from "next/navigation"
import VerifyEmailClient from "@/components/auth/verify-email-client"
import { getCurrentUser } from "@/app/actions/auth-actions"

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get token from query params
  const token = searchParams.token as string | undefined

  // If no token, check if user is logged in
  if (!token) {
    const user = await getCurrentUser()

    // If user is not logged in, redirect to login
    if (!user) {
      redirect("/login")
    }

    // If user is already verified, redirect to dashboard
    if (user.isVerified) {
      redirect("/dashboard")
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailClient token={token} />
      </Suspense>
    </div>
  )
}
