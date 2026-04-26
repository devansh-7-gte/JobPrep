import { RedirectToSignIn } from "@clerk/nextjs";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isProtetcedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/ai-cover-letter(.*)",
  "/interview(.*)",
  "/onboarding(.*)",
]);
export default clerkMiddleware(async(auth, req)=>{
  const userId = await auth();
  if(!userId && isProtetcedRoute(req)){
    return RedirectToSignIn;
  }
  return NextResponse.next();
});



export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - static files
     * - _next
     * - favicon
     */
    "/((?!_next|.*\\..*).*)",
  ],
};
