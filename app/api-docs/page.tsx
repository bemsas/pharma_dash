import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, FileText } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SwaggerUI from "@/components/swagger-ui"

export const metadata: Metadata = {
  title: "API Documentation | Pharma Dashboard",
  description: "API documentation for the Pharma Dashboard",
}

// Define the API documentation structure
const apiDocs = [
  { id: "overview", title: "API Overview", file: "README.md", icon: FileText },
  { id: "auth", title: "Authentication API", file: "auth.md", icon: FileText },
  { id: "companies", title: "Companies API", file: "companies.md", icon: FileText },
  { id: "financials", title: "Financial Data API", file: "financials.md", icon: FileText },
  { id: "news", title: "News Articles API", file: "news.md", icon: FileText },
  { id: "pipeline", title: "Pipeline API", file: "pipeline.md", icon: FileText },
  { id: "users", title: "User Management API", file: "users.md", icon: FileText },
  { id: "versioning", title: "API Versioning", file: "versioning.md", icon: FileText },
]

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      <p className="text-gray-600 mb-8">
        Access comprehensive documentation for the Pharma Dashboard API. Explore our interactive API documentation or
        browse detailed guides.
      </p>

      <Tabs defaultValue="interactive" className="mb-8">
        <TabsList>
          <TabsTrigger value="interactive">Interactive API Explorer</TabsTrigger>
          <TabsTrigger value="guides">API Guides</TabsTrigger>
        </TabsList>
        <TabsContent value="interactive" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive API Explorer</CardTitle>
              <CardDescription>
                Try out API endpoints directly in your browser. This interactive documentation allows you to make
                requests and see responses in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SwaggerUI url="/api/openapi.yaml" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="guides" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apiDocs.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <doc.icon className="mr-2 h-5 w-5" />
                    {doc.title}
                  </CardTitle>
                  <CardDescription>Documentation for {doc.title.toLowerCase()} endpoints</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/api-docs/${doc.id}`} className="flex items-center text-blue-600 hover:text-blue-800">
                    View Documentation
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
