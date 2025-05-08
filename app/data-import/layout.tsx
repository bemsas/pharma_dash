import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Data Import | Pharma Dashboard",
  description: "Import and manage pharmaceutical data",
}

export default function DataImportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
