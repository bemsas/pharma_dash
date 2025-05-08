import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { sessionManager } from "./lib/auth/session-manager"
import { getUserById } from "./lib/auth/user-repository"

// Define public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/register",
  "/verify-email",
  "/home",
  "/landing",
  "/api-docs",
  "/api-docs/:path*",
  "/forgot-password",
  "/reset-password",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
]

// Define routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/settings",
  "/companies",
  "/news",
  "/insights",
  "/financials",
  "/pipeline",
  "/portfolio",
]

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value
  const { pathname } = request.nextUrl

  // Check if this is the root path and redirect to landing
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/landing", request.url))
  }

  // Allow access to public routes without authentication
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // If no session and trying to access protected route, redirect to login
  if (!sessionId && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If has session, validate it
  if (sessionId) {
    try {
      // Validate session
      const session = await sessionManager.getSession(sessionId)

      if (!session || !session.userId) {
        // Invalid or expired session, redirect to login if trying to access protected route
        if (isProtectedRoute) {
          const response = NextResponse.redirect(new URL("/login", request.url))
          response.cookies.delete("session_id")
          return response
        }
        return NextResponse.next()
      }

      // Get user data
      const user = await getUserById(session.userId)

      if (!user) {
        // User not found, redirect to login if trying to access protected route
        if (isProtectedRoute) {
          const response = NextResponse.redirect(new URL("/login", request.url))
          response.cookies.delete("session_id")
          return response
        }
        return NextResponse.next()
      }

      // Check if user is verified
      if (!user.isVerified && isProtectedRoute) {
        // User not verified, redirect to verification page
        return NextResponse.redirect(new URL("/verify-email", request.url))
      }

      // User is authenticated and verified, proceed
      return NextResponse.next()
    } catch (error) {
      console.error("Middleware error:", error)
      // Error occurred, redirect to login if trying to access protected route
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
      return NextResponse.next()
    }
  }

  // For all other cases, proceed
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
     * - api routes that don't require authentication
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth/verify-session).*)",
  ],
}
