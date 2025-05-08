import { DashboardContent } from "@/components/dashboard-content"
import { getUserFavorites } from "@/app/actions/favorites-actions"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Dashboard | Pharma Dashboard",
  description: "Analyze pharmaceutical companies and their key metrics",
}

export default async function DashboardPage() {
  // Get user favorites
  const userFavorites = await getUserFavorites()

  return (
    <div className="container py-6">
      <DashboardContent userFavorites={userFavorites} />
    </div>
  )
}
