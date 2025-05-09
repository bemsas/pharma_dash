"use client"

import { useState, useEffect } from "react"
import { Calendar, Newspaper, Search, ThumbsDown, ThumbsUp, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { getPfizerNewsArticles, type PfizerNewsArticle } from "@/lib/pfizer-data"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

interface NewsArticlesListProps {
  company: string
  diseaseArea?: string | null
}

// Sample news data for non-Pfizer companies
const allNewsArticles = [
  {
    id: 1,
    company: "Johnson & Johnson",
    diseaseArea: "Multiple Myeloma",
    title: "Johnson & Johnson Faces New Litigation Over Product Safety",
    source: "Wall Street Journal",
    date: "2025-04-28",
    snippet:
      "Johnson & Johnson is facing a new round of lawsuits related to product safety concerns, potentially impacting the company's financial outlook for the coming year.",
    sentiment: "negative",
    category: "Legal",
  },
  {
    id: 2,
    company: "Merck",
    diseaseArea: "Diabetes",
    title: "Merck Expands Manufacturing Capacity in Asia",
    source: "Pharma Manufacturing",
    date: "2025-04-25",
    snippet:
      "Merck has announced a significant investment to expand its manufacturing capabilities in Singapore, aiming to meet growing demand in Asian markets.",
    sentiment: "positive",
    category: "Business",
  },
  {
    id: 3,
    company: "AbbVie",
    diseaseArea: "Rheumatoid Arthritis",
    title: "AbbVie's Patent for Blockbuster Drug Challenged",
    source: "Reuters",
    date: "2025-04-22",
    snippet:
      "Generic drug manufacturers have filed a legal challenge against AbbVie's patent extension for its blockbuster immunology drug, potentially opening the door to earlier generic competition.",
    sentiment: "negative",
    category: "Legal",
  },
]

export function NewsArticlesList({ company, diseaseArea }: NewsArticlesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sentimentFilter, setSentimentFilter] = useState("all")
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])
  const [pfizerArticles, setPfizerArticles] = useState<PfizerNewsArticle[]>([])
  const isMobile = useMobile()

  // Get real Pfizer news articles if company is Pfizer
  useEffect(() => {
    if (company === "Pfizer") {
      setPfizerArticles(getPfizerNewsArticles(diseaseArea))
    }
  }, [company, diseaseArea])

  // Filter articles based on company, disease area, sentiment, and search query
  useEffect(() => {
    let articles: any[] = []

    if (company === "Pfizer") {
      // Use real Pfizer data
      articles = pfizerArticles.map((article, index) => ({
        id: index + 1,
        company: "Pfizer",
        title: article.title,
        source: article.source,
        date: article.publication_date,
        snippet: article.summary,
        sentiment: article.sentiment.toLowerCase(),
        category: article.url.includes("press-release")
          ? "Press Release"
          : article.url.includes("pharma")
            ? "Industry News"
            : "General",
        url: article.url,
      }))
    } else {
      // Use sample data for other companies
      articles = allNewsArticles.filter((article) => article.company === company)

      // Filter by disease area if provided
      if (diseaseArea) {
        articles = articles.filter((article) => article.diseaseArea === diseaseArea)
      }
    }

    // Filter by sentiment
    if (sentimentFilter !== "all") {
      articles = articles.filter((article) => article.sentiment.toLowerCase() === sentimentFilter)
    }

    // Filter by search query
    if (searchQuery) {
      articles = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.snippet.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredArticles(articles)
  }, [company, diseaseArea, searchQuery, sentimentFilter, pfizerArticles])

  // Function to handle article link click
  const handleArticleClick = (url: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start justify-between space-y-2 sm:space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Newspaper className="h-5 w-5 text-blue-600" />
            News Articles for {company}
            {diseaseArea && ` • ${diseaseArea}`}
          </CardTitle>
          <CardDescription>Latest news and developments affecting the company</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All Sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sentiment</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div key={article.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    {article.url ? (
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleArticleClick(article.url)}
                          className="text-left font-semibold hover:text-blue-600 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1 -ml-1 py-1 touch-manipulation"
                          aria-label={`Read article: ${article.title}`}
                        >
                          {article.title}
                        </button>
                        <div className="mt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 touch-manipulation"
                            onClick={() => handleArticleClick(article.url)}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Read full article
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <h3 className="font-semibold">{article.title}</h3>
                    )}
                  </div>
                  <Badge
                    className={`rounded-full px-3 self-start ${
                      article.sentiment.toLowerCase() === "positive"
                        ? "bg-green-500 text-white"
                        : article.sentiment.toLowerCase() === "negative"
                          ? "bg-red-500 text-white"
                          : "bg-gray-500 text-white"
                    }`}
                  >
                    {article.sentiment.toLowerCase() === "positive" ? (
                      <>
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        Positive
                      </>
                    ) : article.sentiment.toLowerCase() === "negative" ? (
                      <>
                        <ThumbsDown className="mr-1 h-3 w-3" />
                        Negative
                      </>
                    ) : (
                      "Neutral"
                    )}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{article.source}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {article.date}
                  </span>
                  <span>•</span>
                  <Badge variant="outline">{article.category}</Badge>
                </div>
                <p className="text-sm">{article.snippet}</p>
                {article.id !== filteredArticles[filteredArticles.length - 1].id && <Separator className="mt-2" />}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No news articles found for {company} {diseaseArea ? `related to ${diseaseArea}` : ""}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
