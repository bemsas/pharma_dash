"use client"

import { useState, useEffect } from "react"
import { Calendar, Newspaper, Search, ThumbsDown, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface NewsArticlesListProps {
  company: string
  diseaseArea?: string | null
}

// Sample news data
const allNewsArticles = [
  {
    id: 1,
    company: "Pfizer",
    diseaseArea: "NSCLC (non small cell lung cancer)",
    title: "Pfizer Announces Breakthrough in Cancer Treatment Research",
    source: "MedicalNews Today",
    date: "2025-05-01",
    snippet:
      "Pharmaceutical giant Pfizer has announced promising results from a Phase 3 clinical trial for its new oncology drug targeting rare forms of lung cancer.",
    sentiment: "positive",
    category: "Research",
  },
  {
    id: 2,
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
    id: 3,
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
    id: 4,
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
  {
    id: 5,
    company: "Pfizer",
    diseaseArea: "Breast Cancer",
    title: "Pfizer's New Breast Cancer Drug Shows Promise in Early Trials",
    source: "Cancer Research Journal",
    date: "2025-04-18",
    snippet:
      "Pfizer's experimental breast cancer treatment has shown promising results in early-stage clinical trials, potentially offering a new option for patients with specific genetic markers.",
    sentiment: "positive",
    category: "Research",
  },
  {
    id: 6,
    company: "Pfizer",
    diseaseArea: "COVID-19",
    title: "Pfizer Updates COVID-19 Vaccine for New Variants",
    source: "Health News Daily",
    date: "2025-04-15",
    snippet:
      "Pfizer has announced an updated version of its COVID-19 vaccine designed to target emerging variants, with regulatory submissions planned for next month.",
    sentiment: "positive",
    category: "Research",
  },
]

export function NewsArticlesList({ company, diseaseArea }: NewsArticlesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sentimentFilter, setSentimentFilter] = useState("all")
  const [filteredArticles, setFilteredArticles] = useState(allNewsArticles)

  // Filter articles based on company, disease area, sentiment, and search query
  useEffect(() => {
    let articles = allNewsArticles

    // Filter by company
    if (company) {
      articles = articles.filter((article) => article.company === company)
    }

    // Filter by disease area if provided
    if (diseaseArea) {
      articles = articles.filter((article) => article.diseaseArea === diseaseArea)
    }

    // Filter by sentiment
    if (sentimentFilter !== "all") {
      articles = articles.filter((article) => article.sentiment === sentimentFilter)
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
  }, [company, diseaseArea, searchQuery, sentimentFilter])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Newspaper className="h-5 w-5 text-blue-600" />
            News Articles for {company}
            {diseaseArea && ` • ${diseaseArea}`}
          </CardTitle>
          <CardDescription>Latest news and developments affecting the company</CardDescription>
        </div>
        <div className="flex items-center gap-2">
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
            <SelectTrigger className="w-[150px]">
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
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{article.title}</h3>
                  <Badge
                    className={`rounded-full px-3 ${
                      article.sentiment === "positive"
                        ? "bg-green-500 text-white"
                        : article.sentiment === "negative"
                          ? "bg-red-500 text-white"
                          : "bg-gray-500 text-white"
                    }`}
                  >
                    {article.sentiment === "positive" ? (
                      <>
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        Positive
                      </>
                    ) : article.sentiment === "negative" ? (
                      <>
                        <ThumbsDown className="mr-1 h-3 w-3" />
                        Negative
                      </>
                    ) : (
                      "Neutral"
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
