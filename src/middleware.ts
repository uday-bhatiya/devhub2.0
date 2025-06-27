import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const authRoutes = ["/login", "/register"]

const protectedRoutes = ["/home"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const isLoggedIn = !!token
  const pathname = request.nextUrl.pathname

  if (isLoggedIn && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  if (!isLoggedIn && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/register", "/home/:path*"], // Run middleware on these routes
}
