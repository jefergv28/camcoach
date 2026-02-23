import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Lee la cookie (request.cookies la ve aunque sea httpOnly)
  const token = request.cookies.get("camcoach_token")?.value;

  console.log("[Middleware] Ruta solicitada:", request.nextUrl.pathname);
  console.log("[Middleware] Cookie camcoach_token encontrada:", !!token);

  if (token) {
    console.log("[Middleware] Token (primeros 20 chars):", token.substring(0, 20));
  }

  // Protección dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
    console.log("[Middleware] Sin token → redirigiendo a /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si ya está logueado y va a login/register → redirige a dashboard
  if (
    (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") &&
    token
  ) {
    console.log("[Middleware] Ya logueado → redirigiendo a /dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};