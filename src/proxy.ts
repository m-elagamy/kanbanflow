import {
  clerkMiddleware as proxy,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { isDevAuthBypass } from "@/utils/dev-auth";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password",
  "/sso-callback",
  "/robots.txt",
  "/sitemap.xml",
  "/opengraph-image",
]);

export default proxy(async (auth, request) => {
  if (!isDevAuthBypass() && !isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Clerk's auto-proxy requests
    "/__clerk/:path*",
  ],
};
