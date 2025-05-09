"use client"

import { useSearchParams } from "next/navigation"
import { PortfolioPage } from "@/components/portfolio-page"

export function PortfolioPageWrapper() {
  const searchParams = useSearchParams()
  const companyParam = searchParams.get("company") || "Pfizer"
  const diseaseAreaParam = searchParams.get("diseaseArea") || ""

  return <PortfolioPage company={companyParam} diseaseArea={diseaseAreaParam} />
}
