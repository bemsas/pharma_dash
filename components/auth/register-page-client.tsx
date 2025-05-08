"use client"

import { AuthLayout } from "@/components/auth/auth-layout"
import { RegisterForm } from "@/components/auth/register-form"

export function RegisterPageClient() {
  return (
    <AuthLayout>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Pharma Dashboard</h1>
            <p className="mt-2 text-gray-600">Create a new account</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </AuthLayout>
  )
}
