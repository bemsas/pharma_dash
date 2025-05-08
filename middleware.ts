import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// NOTE: Authentication is temporarily disabled
// Protected routes that would normally require authentication (kept for future reference)
const protectedRoutes = [
  // Commented out to disable auth requirement
  // "/settings",
  // "/dashboard/admin"
]

// Public routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/register"]

// Routes that don't require verification
const noVerificationRoutes = ["/verify-email", "/login", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // TEMPORARY: Skip all authentication checks and allow access to all routes
  // This section will bypass all authentication requirements

  // If trying to access login/register pages, redirect to dashboard
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    console.log(`Redirecting from ${pathname} to dashboard (auth bypass enabled)`)
    return NextResponse.redirect(new URL("/", request.url))
  }

  // For all other routes, allow access
  return NextResponse.next()

  /* ORIGINAL AUTHENTICATION CODE - Kept for future use
  const sessionId = request.cookies.get("sessionId")?.value

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  const isNoVerificationRoute = noVerificationRoutes.some((route) => pathname.startsWith(route))

  // If no session and trying to access protected route, redirect to login
  if (!sessionId && isProtectedRoute) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // If has session and trying to access auth routes, redirect to dashboard
  if (sessionId && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If has session, check verification status
  if (sessionId && !isNoVerificationRoute) {
    // Get session data from cookie
    const sessionData = request.cookies.get("sessionId")?.value

    // In a real implementation, you would decode and verify the session
    // For this example, we'll use a simple check
    try {
      // This is a simplified check - in a real app, you'd decode and verify the JWT
      const response = await fetch(new URL("/api/auth/verify-session", request.url), {
        headers: {
          Cookie: `sessionId=${sessionId}`,
        },
      })

      const data = await response.json()

      // If user is not verified and trying to access a route that requires verification
      if (!data.isVerified && !isNoVerificationRoute) {
        return NextResponse.redirect(new URL("/verify-email", request.url))
      }
    } catch (error) {
      console.error("Error verifying session:", error)
    }
  }

  return NextResponse.next()
  */
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need auth checks
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/public).*)",
  ],
}
