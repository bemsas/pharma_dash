"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PortfolioPage() {
  const searchParams = useSearchParams()
  const companyParam = searchParams.get("company") || "Pfizer"
  const diseaseAreaParam = searchParams.get("diseaseArea") || null

  // Get portfolio data for Pfizer
  const pfizerPortfolioData = [
    {
      area_name: "Oncology",
      top_products: ["Ibrance", "Xtandi", "Inlyta"],
      growth_products: ["Padcev", "Adcetris"],
      patent_risk_products: ["Older oncology drugs (specifics require detailed patent analysis)"],
    },
    {
      area_name: "Inflammation & Immunology",
      top_products: ["Xeljanz", "Enbrel (international)"],
      growth_products: ["Cibinqo", "Velsipity"],
      patent_risk_products: ["Xeljanz (facing biosimilar competition)"],
    },
    {
      area_name: "Vaccines",
      top_products: ["Comirnaty", "Prevnar family"],
      growth_products: ["Abrysvo", "Nimenrix"],
      patent_risk_products: ["Older vaccine technologies (general risk, manufacturing complexity is a barrier)"],
    },
  ]

  // Sample data for non-Pfizer companies
  const samplePortfolio = [
    {
      area_name: "Oncology",
      top_products: ["Product A", "Product B", "Product C"],
      growth_products: ["Product D", "Product E"],
      patent_risk_products: ["Product F (patent expiring 2026)"],
    },
    {
      area_name: "Cardiovascular",
      top_products: ["Product G", "Product H"],
      growth_products: ["Product I"],
      patent_risk_products: ["Product J (generic competition)"],
    },
  ]

  // Use Pfizer data if company is Pfizer, otherwise use sample data
  const displayData = companyParam === "Pfizer" ? pfizerPortfolioData : samplePortfolio

  // Filter by disease area if provided
  const filteredData = diseaseAreaParam
    ? displayData.filter(
        (area) =>
          area.area_name === diseaseAreaParam ||
          area.area_name.includes(diseaseAreaParam) ||
          diseaseAreaParam.includes(area.area_name),
      )
    : displayData

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-2">Product Portfolio</h1>
        <p className="text-gray-600">
          Key products by therapeutic area for {companyParam}
          {diseaseAreaParam && ` - ${diseaseAreaParam}`}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Product Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredData.map((area, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <h3 className="text-lg font-semibold mb-3">{area.area_name}</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Top Products</h4>
                    <div className="flex flex-wrap gap-2">
                      {area.top_products.map((product, idx) => (
                        <Badge key={idx} className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Growth Products</h4>
                    <div className="flex flex-wrap gap-2">
                      {area.growth_products.map((product, idx) => (
                        <Badge key={idx} className="bg-green-100 text-green-800 hover:bg-green-100">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Patent Risk</h4>
                    <div className="flex flex-wrap gap-2">
                      {area.patent_risk_products.map((product, idx) => (
                        <Badge key={idx} className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {index < filteredData.length - 1 && <div className="border-t my-4"></div>}
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No portfolio data available for the selected criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
