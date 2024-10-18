import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If the user is authenticated (has a token) and tries to access sign-in or sign-up pages, redirect to dashboard
  // if (token && (url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/signup"))) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // If the user is not authenticated and tries to access protected routes like dashboard, redirect to sign-in
  if (!token && (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/verify"))) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow users without tokens to access public pages like sign-in or sign-up
  return NextResponse.next();
}

export const config = {
  matcher: [ "/home", "/dashboard/:path*"],
};
