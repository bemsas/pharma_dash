import type React from "react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthProvider } from "@/components/auth/auth-context"

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthLayout>{children}</AuthLayout>
    </AuthProvider>
  )
}
