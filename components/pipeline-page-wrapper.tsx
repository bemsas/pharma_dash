"use client"

import { useSearchParams } from "next/navigation"
import { PipelinePage } from "@/components/pipeline-page"

export function PipelinePageWrapper() {
  const searchParams = useSearchParams()
  const companyParam = searchParams.get("company") || "Pfizer"
  const diseaseAreaParam = searchParams.get("diseaseArea") || ""

  return <PipelinePage company={companyParam} diseaseArea={diseaseAreaParam} />
}
