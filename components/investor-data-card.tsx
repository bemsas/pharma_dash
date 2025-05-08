"use client"
import { BarChart, LineChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Chart from "@/data-chart/line/1"
import BarChart1 from "@/data-chart/bar/1"
import { ChartWrapper } from "@/data-chart/wrapper"

interface InvestorDataCardProps {
  company: string
}

export function InvestorDataCard({ company }: InvestorDataCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Historic Investor Data</CardTitle>
        <CardDescription>Investment trends and valuation metrics</CardDescription>
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
                  <div className="text-2xl font-bold">$67.42</div>
                  <div className="text-xs text-muted-foreground">Current Price</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">+2.4%</div>
                  <div className="text-xs text-muted-foreground">YTD Return</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">$384B</div>
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
                  <div className="text-2xl font-bold">16.8x</div>
                  <div className="text-xs text-muted-foreground">P/E Ratio</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">3.2%</div>
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
