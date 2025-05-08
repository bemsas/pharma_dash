import type React from "react"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>
}
