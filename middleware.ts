import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public paths that don't require authentication
const publicPaths = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/landing",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/verify-email",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/user",
  // Temporarily add dashboard and related paths to public paths
  "/dashboard",
  "/companies",
  "/news",
  "/insights",
  "/financials",
  "/pipeline",
  "/portfolio",
  "/settings",
]

// Define routes that require authentication (keeping for future use)
const protectedRoutes = [
  // These are temporarily commented out to bypass auth
  // "/dashboard",
  // "/settings",
  // "/companies",
  // "/news",
  // "/insights",
  // "/financials",
  // "/pipeline",
  // "/portfolio",
]

// Define API routes that should be excluded from middleware
const apiRoutes = ["/api/auth/verify-session", "/api/auth/login", "/api/auth/register"]

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value
  const { pathname } = request.nextUrl

  console.log(`Middleware processing path: ${pathname}`)

  // Skip middleware for API routes that handle their own authentication
  if (apiRoutes.some((route) => pathname.startsWith(route))) {
    console.log(`Skipping middleware for API route: ${pathname}`)
    return NextResponse.next()
  }

  // Check if this is the root path and redirect to dashboard directly
  if (pathname === "/") {
    console.log("Redirecting from root to dashboard page")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Allow access to all public routes without authentication
  if (
    publicPaths.some((route) => {
      const isMatch =
        pathname === route ||
        (route.endsWith("*") && pathname.startsWith(route.slice(0, -1))) ||
        pathname.startsWith("/api/") // Allow all API routes
      if (isMatch) console.log(`Matched public route: ${route}`)
      return isMatch
    })
  ) {
    console.log(`Allowing access to public route: ${pathname}`)
    return NextResponse.next()
  }

  // For all other cases, proceed
  console.log(`Proceeding to: ${pathname}`)
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
