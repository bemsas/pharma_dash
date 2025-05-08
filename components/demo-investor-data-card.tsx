import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface DemoInvestorDataCardProps {
  companyName: string
}

export function DemoInvestorDataCard({ companyName }: DemoInvestorDataCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Historic Investor Data</CardTitle>
            <CardDescription>Investment trends and valuation metrics</CardDescription>
          </div>
          <div className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">Demo Content</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart placeholder */}
          <div className="relative h-48 rounded-lg bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500">Stock Performance Chart</div>
                <div className="mt-1 text-xs text-gray-400">(Demo data - not actual performance)</div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-100 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 h-px bg-blue-200"></div>
            <div className="absolute bottom-4 left-1/4 h-12 w-1 bg-blue-300"></div>
            <div className="absolute bottom-4 left-2/4 h-20 w-1 bg-blue-400"></div>
            <div className="absolute bottom-4 left-3/4 h-8 w-1 bg-blue-300"></div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 py-1 text-xs text-gray-500">
              <span>Q1</span>
              <span>Q2</span>
              <span>Q3</span>
              <span>Q4</span>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border p-3">
              <div className="text-sm text-gray-500">Market Cap</div>
              <div className="text-lg font-semibold">$245.8B</div>
              <div className="text-xs text-green-600">+2.4% YTD</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-sm text-gray-500">P/E Ratio</div>
              <div className="text-lg font-semibold">18.6</div>
              <div className="text-xs text-gray-500">Industry Avg: 22.3</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-sm text-gray-500">Dividend Yield</div>
              <div className="text-lg font-semibold">3.2%</div>
              <div className="text-xs text-green-600">+0.3% vs Last Year</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-sm text-gray-500">Analyst Rating</div>
              <div className="text-lg font-semibold">Buy</div>
              <div className="text-xs text-gray-500">8 Buy, 3 Hold, 1 Sell</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center rounded-md bg-gray-50 p-3 text-sm text-gray-500">
          <AlertCircle className="mr-2 h-4 w-4" />
          <span>This is demo data. Create an account to see real financial metrics.</span>
        </div>
      </CardContent>
    </Card>
  )
}
