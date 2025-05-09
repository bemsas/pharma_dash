import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PipelinePageWrapper } from "@/components/pipeline-page-wrapper"

export default function Pipeline() {
  return (
    <DashboardLayout>
      <Suspense fallback={<PipelineLoadingSkeleton />}>
        <PipelinePageWrapper />
      </Suspense>
    </DashboardLayout>
  )
}

function PipelineLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow animate-pulse">
        <div className="h-8 w-1/3 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow animate-pulse">
        <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}
