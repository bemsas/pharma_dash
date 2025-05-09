"use client"
import { BarChart, LineChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Chart from "@/data-chart/line/1"
import BarChart1 from "@/data-chart/bar/1"
import { ChartWrapper } from "@/data-chart/wrapper"
import { getPfizerFinancialData } from "@/lib/pfizer-data"

interface InvestorDataCardProps {
  company: string
}

export function InvestorDataCard({ company }: InvestorDataCardProps) {
  // Get real financial data if company is Pfizer
  const financialData =
    company === "Pfizer"
      ? getPfizerFinancialData()
      : {
          currentPrice: "$67.42",
          ytdReturn: "+2.4%",
          marketCap: "$384B",
          peRatio: "16.8",
          dividendYield: "3.2%",
        }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Historic Investor Data</CardTitle>
        <CardDescription>
          Investment trends and valuation metrics
          {company === "Pfizer" && <span className="ml-1 text-blue-600">(Real-time data)</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stock">
          <TabsList className="mb-4">
            <TabsTrigger value="stock" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              Stock Performance
            </TabsTrigger>
            <TabsTrigger value="valuation" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              Valuation
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stock" className="mt-0">
            <div className="space-y-4">
              <div className="h-[250px] border rounded-md p-2">
                <ChartWrapper content={Chart} className="h-full w-full" title={`${company} Stock Performance`} />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{financialData.currentPrice}</div>
                  <div className="text-xs text-muted-foreground">Current Price</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{financialData.ytdReturn}</div>
                  <div className="text-xs text-muted-foreground">YTD Return</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{financialData.marketCap}</div>
                  <div className="text-xs text-muted-foreground">Market Cap</div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="valuation" className="mt-0">
            <div className="space-y-4">
              <div className="h-[250px]">
                <ChartWrapper content={BarChart1} className="h-full w-full" title={`${company} Valuation Metrics`} />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{financialData.peRatio}x</div>
                  <div className="text-xs text-muted-foreground">P/E Ratio</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{financialData.dividendYield}</div>
                  <div className="text-xs text-muted-foreground">Dividend Yield</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">4.2x</div>
                  <div className="text-xs text-muted-foreground">EV/EBITDA</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
