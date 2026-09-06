import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)'
]);

export default function middleware(req, evt) {
  const pathname = req.nextUrl.pathname;

  // Never touch Next.js internals or static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if Clerk keys are present in environment
  const publishableKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    process.env.CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!publishableKey || !secretKey) {
    // If Clerk keys are missing on Vercel, bypass authentication gracefully
    return NextResponse.next();
  }

  try {
    return clerkMiddleware((auth, request) => {
      if (isProtectedRoute(request)) {
        auth().protect();
      }
    })(req, evt);
  } catch (err) {
    console.error("Clerk middleware invocation error:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};


