"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

// Sample pharmaceutical companies
const companies = [
  "Pfizer Inc.",
  "Johnson & Johnson",
  "Merck & Co.",
  "AbbVie Inc.",
  "Bristol-Myers Squibb",
  "Eli Lilly and Company",
  "Amgen Inc.",
  "Gilead Sciences",
  "Novartis AG",
  "Roche Holding AG",
  "AstraZeneca PLC",
  "GlaxoSmithKline plc",
]

interface DemoCompanySelectorProps {
  selectedCompany: string
  onSelectCompany: (company: string) => void
}

export function DemoCompanySelector({ selectedCompany, onSelectCompany }: DemoCompanySelectorProps) {
  return (
    <Card>
      <CardContent className="p-4">
        {/* Search input - disabled in demo */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search for a pharmaceutical company..."
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 pl-10 text-gray-400"
            disabled
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Info message */}
        <div className="mb-4 flex items-start rounded-md bg-blue-50 p-3 text-sm text-blue-700">
          <Info className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>
            In this demo, filtering is disabled. The list below shows sample pharmaceutical companies from our database.
          </p>
        </div>

        {/* Tabs - non-clickable in demo */}
        <div className="mb-4 flex border-b">
          <Button variant="ghost" className="border-b-2 border-blue-600 px-4 py-2 text-blue-600" disabled>
            Popular
          </Button>
          <Button variant="ghost" className="px-4 py-2 text-gray-400 opacity-50" disabled>
            Recent
          </Button>
          <Button variant="ghost" className="px-4 py-2 text-gray-400 opacity-50" disabled>
            All Companies
          </Button>
        </div>

        {/* Company grid */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {companies.map((company) => (
            <Button
              key={company}
              variant={selectedCompany === company ? "default" : "outline"}
              className={`justify-start text-left ${
                selectedCompany === company ? "bg-blue-600 text-white" : "text-gray-700"
              }`}
              onClick={() => onSelectCompany(company)}
            >
              {company}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
