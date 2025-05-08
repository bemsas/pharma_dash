import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Newspaper, TrendingUp, FlaskRoundIcon as Flask, Lock } from "lucide-react"

interface DemoNewsArticlesListProps {
  companyName: string
}

export function DemoNewsArticlesList({ companyName }: DemoNewsArticlesListProps) {
  // Generate demo news articles based on the company name
  const demoArticles = [
    {
      id: 1,
      title: `${companyName} Reports Positive Phase 3 Trial Results`,
      source: "Pharma Times",
      date: "2 hours ago",
      category: "Clinical",
      icon: Flask,
    },
    {
      id: 2,
      title: `${companyName} Announces Quarterly Financial Results`,
      source: "Financial News",
      date: "1 day ago",
      category: "Financial",
      icon: TrendingUp,
    },
    {
      id: 3,
      title: `${companyName} Expands Partnership with Research Institute`,
      source: "Biotech Daily",
      date: "2 days ago",
      category: "Business",
      icon: Newspaper,
    },
    {
      id: 4,
      title: `New Drug Application Filed by ${companyName}`,
      source: "Regulatory Focus",
      date: "3 days ago",
      category: "Regulatory",
      icon: Flask,
    },
  ]

  return (
    <div className="space-y-3">
      {demoArticles.map((article) => (
        <Card key={article.id} className="overflow-hidden">
          <div className="flex items-start p-4">
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <article.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-medium">{article.title}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <span>{article.source}</span>
                <span className="mx-2">•</span>
                <span>{article.date}</span>
                <span className="mx-2">•</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{article.category}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="ml-2 cursor-not-allowed opacity-50" disabled>
              <Lock className="mr-1 h-3 w-3" />
              View
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
