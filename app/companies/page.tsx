import { CompaniesPage } from "@/components/companies-page"
import { getUserFavorites } from "@/app/actions/favorites-actions"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Companies | Pharma Dashboard",
  description: "Browse and select pharmaceutical companies for analysis",
}

export default async function CompaniesPageRoute() {
  // Get user favorites
  const userFavorites = await getUserFavorites()

  return (
    <div className="container py-6">
      <CompaniesPage userFavorites={userFavorites} />
    </div>
  )
}
