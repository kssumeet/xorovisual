import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/content/projects";

const caseStudies = new Set(projects.filter((p) => p.caseStudy).map((p) => p.slug));

/**
 * Case studies stream behind a static shell, so a notFound() thrown during
 * render would arrive with a 200 status. Unknown slugs are caught here,
 * before rendering, and served the not-found page with a real 404.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !caseStudies.has(slug)) {
    return NextResponse.rewrite(new URL("/__not-found", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/work/:slug",
};
