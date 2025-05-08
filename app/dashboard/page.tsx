import { DashboardContent } from "@/components/dashboard-content"
import { getUserFavorites } from "@/app/actions/favorites-actions"
import { getSessionData } from "@/lib/auth/session-manager"
import { getUserById } from "@/lib/auth/user-repository"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Dashboard | Pharma Dashboard",
  description: "Analyze pharmaceutical companies and their key metrics",
}

export default async function DashboardPage() {
  // Verify user is authenticated
  const session = await getSessionData()

  if (!session || !session.userId) {
    console.log("No valid session found, redirecting to login")
    redirect("/login")
  }

  // Get user data
  const user = await getUserById(session.userId)

  if (!user) {
    console.log("User not found, redirecting to login")
    redirect("/login")
  }

  if (!user.isVerified) {
    console.log("User not verified, redirecting to verification page")
    redirect("/verify-email")
  }

  console.log(`User ${user.id} authenticated and verified, rendering dashboard`)

  // Get user favorites
  const userFavorites = await getUserFavorites()

  return (
    <div className="container py-6">
      <DashboardContent userFavorites={userFavorites} />
    </div>
  )
}
