import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductPortfolioCardProps {
  company: string
  diseaseArea?: string | null
}

export function ProductPortfolioCard({ company, diseaseArea }: ProductPortfolioCardProps) {
  // Pfizer product portfolio data
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
      top_products: ["Product A", "Product B"],
      growth_products: ["Product C"],
      patent_risk_products: ["Product D (patent expiring 2026)"],
    },
  ]

  // Only show for Pfizer
  if (company !== "Pfizer") {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>Product Portfolio</CardTitle>
          <CardDescription>Key products by therapeutic area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Select Pfizer to view real-time product portfolio data
          </div>
        </CardContent>
      </Card>
    )
  }

  // Filter therapeutic areas by disease area if provided
  const therapeuticAreas = diseaseArea
    ? pfizerPortfolioData.filter(
        (area) =>
          area.area_name === diseaseArea ||
          area.area_name.includes(diseaseArea) ||
          diseaseArea.includes(area.area_name),
      )
    : pfizerPortfolioData

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Product Portfolio</CardTitle>
        <CardDescription>
          Key products by therapeutic area
          {diseaseArea && (
            <span className="ml-1">
              • <span className="font-medium">{diseaseArea}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {therapeuticAreas.length > 0 ? (
          <div className="space-y-6">
            {therapeuticAreas.map((area, index) => (
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

                {index < therapeuticAreas.length - 1 && <div className="border-t my-4"></div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No product portfolio data found for the selected disease area
          </div>
        )}
      </CardContent>
    </Card>
  )
}
