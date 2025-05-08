import type { Metadata } from "next"
import ImportStatistics from "@/components/data-import/statistics"

export const metadata: Metadata = {
  title: "Import Statistics | Pharma Dashboard",
  description: "Visualize data import statistics and trends",
}

export default function ImportStatisticsPage() {
  return <ImportStatistics />
}
