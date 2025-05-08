import type { Metadata } from "next"
import DataImportDashboard from "@/components/data-import/dashboard"

export const metadata: Metadata = {
  title: "Data Import | Pharma Dashboard",
  description: "Import and manage pharmaceutical data",
}

export default function DataImportPage() {
  return <DataImportDashboard />
}
