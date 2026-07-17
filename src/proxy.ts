import { withSoupedAuth } from "@souped-tools/auth-nextjs/proxy";
import { NextResponse } from "next/server";

const passthrough = () => NextResponse.next();

// The SDK's proxy runs on every request that matches `config.matcher`.
// Our matcher is INTENTIONALLY WIDE — it covers the whole site except
// Next.js's own assets. This is required for the Souped site-password gate
// (Vercel-style shared password) to be able to tapar the entire site when
// the owner enables it from the Souped dashboard.
//
// Because the matcher is wide, the SDK's default behaviour is "every route
// requires a session". To keep landings, marketing routes, webhooks, and
// other public surfaces accessible, we list them in `publicRoutes` below.
// `/api/auth/*` is always public (the SDK hard-codes that — it's the login
// flow itself).
//
// Convention for new projects:
//   - `/`                       → public landing (listed in publicRoutes)
//   - `/app/:path*`             → authenticated app (NOT in publicRoutes)
//   - `/api/auth/*`             → always public, never list
//   - `/api/webhooks/:path*`    → if you add webhooks (Stripe, Resend, etc.)
//                                  list them in publicRoutes or they'll get
//                                  redirected to login and fail
//   - `/pricing`, `/about`, …   → add to publicRoutes as you create them
//
// The Souped auth-scaffolder agent tunes `publicRoutes` when it wires
// per-route protection — only edit it manually if you know what you want.
export const proxy = withSoupedAuth(
  {
    publicRoutes: ["/", "/u/:path*"],
  },
  passthrough,
);

// The matcher stays wide (the site-password gate needs to cover the whole
// site), but static assets MUST be excluded — otherwise a browser's parallel
// request for the favicon runs through auth, gets captured as `return_to`, and
// after login the user is redirected to e.g. `/favicon.svg`. Next serves the
// app icon as `favicon.svg`/`favicon.png` (see app metadata), NOT `favicon.ico`,
// so excluding only `favicon.ico` (the old value) let icon requests slip in.
// Exclude every favicon/app-icon variant plus common static asset extensions.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|favicon\\.png|icon|apple-icon|manifest\\.webmanifest|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp|avif|txt|xml|woff2?)$).*)",
  ],
};
