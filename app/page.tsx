import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardContent } from "@/components/dashboard-content"

export default function Home() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-4 text-center">Loading dashboard...</div>}>
        <DashboardContent />
      </Suspense>
    </DashboardLayout>
  )
}
