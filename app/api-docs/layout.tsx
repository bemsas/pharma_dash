import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Documentation | Pharma Dashboard",
  description: "API documentation for the Pharma Dashboard",
}

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-4 bg-white shadow-sm">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Pharma Dashboard API</h1>
        </div>
      </div>
      <main>{children}</main>
    </div>
  )
}
