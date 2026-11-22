import { NextResponse, type NextRequest } from "next/server";
import { sessionCookie } from "./app/super-admin/api";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(sessionCookie)?.value;

  // Protect super-admin dashboard routes
  if (pathname.startsWith("/super-admin") && pathname !== "/super-admin/login") {
    if (!token) {
      const loginUrl = new URL("/super-admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/super-admin/:path*"],
};
