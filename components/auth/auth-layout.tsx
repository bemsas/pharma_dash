"use client"

import { AuthProvider } from "@/components/auth/auth-context"
import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return <AuthProvider>{children}</AuthProvider>
}
