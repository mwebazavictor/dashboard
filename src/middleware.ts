import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Define public routes that don't require authentication
  const publicPaths = ["/", "/login", "/register"];
  const { pathname } = req.nextUrl;

  // Allow requests for static assets or public paths to proceed without a token check
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    publicPaths.includes(pathname)
  ) {
    return NextResponse.next();
  }

  // Retrieve the access token from cookies
  const token = req.cookies.get("accessToken");

  // If no token is found, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply the middleware to all routes
export const config = {
  matcher: "/:path*",
};
