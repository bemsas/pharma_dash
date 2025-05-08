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

  console.log(`Middleware processing path: ${pathname}`)

  // Check if this is the root path and redirect to landing
  if (pathname === "/") {
    console.log("Redirecting from root to landing page")
    return NextResponse.redirect(new URL("/landing", request.url))
  }

  // Allow access to public routes without authentication
  if (
    publicRoutes.some((route) => {
      const isMatch = pathname === route || (route.endsWith("*") && pathname.startsWith(route.slice(0, -1)))
      if (isMatch) console.log(`Matched public route: ${route}`)
      return isMatch
    })
  ) {
    console.log(`Allowing access to public route: ${pathname}`)
    return NextResponse.next()
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => {
    const isMatch = pathname.startsWith(route)
    if (isMatch) console.log(`Matched protected route: ${route}`)
    return isMatch
  })

  // If no session and trying to access protected route, redirect to login
  if (!sessionId && isProtectedRoute) {
    console.log(`No session found, redirecting to login from: ${pathname}`)
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If has session, validate it
  if (sessionId) {
    try {
      console.log(`Validating session: ${sessionId.substring(0, 8)}...`)

      // Validate session
      const session = await sessionManager.getSession(sessionId)

      if (!session || !session.userId) {
        // Invalid or expired session, redirect to login if trying to access protected route
        console.log(`Invalid or expired session`)
        if (isProtectedRoute) {
          console.log(`Redirecting to login from protected route: ${pathname}`)
          const response = NextResponse.redirect(new URL("/login", request.url))
          response.cookies.delete("session_id")
          return response
        }
        return NextResponse.next()
      }

      console.log(`Session valid, user ID: ${session.userId}`)

      // Get user data
      const user = await getUserById(session.userId)

      if (!user) {
        console.log(`User not found for ID: ${session.userId}`)
        // User not found, redirect to login if trying to access protected route
        if (isProtectedRoute) {
          console.log(`Redirecting to login from protected route: ${pathname}`)
          const response = NextResponse.redirect(new URL("/login", request.url))
          response.cookies.delete("session_id")
          return response
        }
        return NextResponse.next()
      }

      // Check if user is verified
      if (!user.isVerified && isProtectedRoute) {
        console.log(`User ${user.id} not verified, redirecting to verification page`)
        // User not verified, redirect to verification page
        return NextResponse.redirect(new URL("/verify-email", request.url))
      }

      console.log(`User ${user.id} authenticated and verified, proceeding to: ${pathname}`)
      // User is authenticated and verified, proceed
      return NextResponse.next()
    } catch (error) {
      console.error("Middleware error:", error)
      // Error occurred, redirect to login if trying to access protected route
      if (isProtectedRoute) {
        console.log(`Error in middleware, redirecting to login from: ${pathname}`)
        return NextResponse.redirect(new URL("/login", request.url))
      }
      return NextResponse.next()
    }
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
     * - api routes that don't require authentication
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth/verify-session).*)",
  ],
}
