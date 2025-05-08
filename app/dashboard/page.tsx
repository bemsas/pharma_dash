import { DashboardContent } from "@/components/dashboard-content"
import { getUserFavorites } from "@/app/actions/favorites-actions"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Dashboard | Pharma Dashboard",
  description: "Analyze pharmaceutical companies and their key metrics",
}

export default async function DashboardPage() {
  // Temporarily bypass authentication checks
  console.log("Rendering dashboard without authentication check")

  // Get user favorites - with error handling for when no user is authenticated
  let userFavorites = []
  try {
    userFavorites = await getUserFavorites()
  } catch (error) {
    console.log("Error fetching user favorites, using empty array:", error)
    // Continue with empty favorites
  }

  return (
    <div className="container py-6">
      <DashboardContent userFavorites={userFavorites} />
    </div>
  )
}
