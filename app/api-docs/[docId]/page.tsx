import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { remark } from "remark"
import html from "remark-html"

// Define the API documentation structure
const apiDocs = [
  { id: "overview", title: "API Overview", file: "README.md" },
  { id: "auth", title: "Authentication API", file: "auth.md" },
  { id: "companies", title: "Companies API", file: "companies.md" },
  { id: "financials", title: "Financial Data API", file: "financials.md" },
  { id: "news", title: "News Articles API", file: "news.md" },
  { id: "pipeline", title: "Pipeline API", file: "pipeline.md" },
  { id: "users", title: "User Management API", file: "users.md" },
  { id: "versioning", title: "API Versioning", file: "versioning.md" },
]

export function generateMetadata({ params }: { params: { docId: string } }): Metadata {
  const doc = apiDocs.find((doc) => doc.id === params.docId)

  if (!doc) {
    return {
      title: "Documentation Not Found | Pharma Dashboard",
    }
  }

  return {
    title: `${doc.title} | API Documentation | Pharma Dashboard`,
    description: `Documentation for the ${doc.title} endpoints`,
  }
}

export function generateStaticParams() {
  return apiDocs.map((doc) => ({
    docId: doc.id,
  }))
}

async function getDocContent(filename: string) {
  try {
    const filePath = path.join(process.cwd(), "docs", "api", filename)
    const fileContent = fs.readFileSync(filePath, "utf8")

    // Convert markdown to HTML
    const processedContent = await remark().use(html).process(fileContent)

    return processedContent.toString()
  } catch (error) {
    console.error(`Error reading file: ${filename}`, error)
    return null
  }
}

export default async function ApiDocPage({ params }: { params: { docId: string } }) {
  const doc = apiDocs.find((doc) => doc.id === params.docId)

  if (!doc) {
    notFound()
  }

  const content = await getDocContent(doc.file)

  if (!content) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/api-docs" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to API Documentation
      </Link>

      <h1 className="text-3xl font-bold mb-6">{doc.title}</h1>

      <div className="prose prose-blue max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  )
}
