import type React from "react"
import { AuthProvider } from "@/components/auth/auth-context"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthLayout>{children}</AuthLayout>
    </AuthProvider>
  )
}
