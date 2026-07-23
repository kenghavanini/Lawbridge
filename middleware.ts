import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const AUTH_REQUIRED_PREFIXES = ["/lawyer", "/verify", "/client"];
const VERIFICATION_REQUIRED_PREFIXES = ["/lawyer"];

export async function middleware(request: NextRequest) {
  const supabaseResponse = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const requiresAuth = AUTH_REQUIRED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (requiresAuth) {
    // If needed, session/verification checks can hook in here
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
