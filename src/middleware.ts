import { NextResponse, type NextRequest } from "next/server";

// Pages for artists no longer shown on the site.
//
// These were indexed and ranking (mohini-kaur held position 4.7 on 142
// impressions, naira-mushtaq 6.2 on 98) when they were removed. The three
// options are all different signals, and only one says what we mean:
//
//   404 Not Found — "missing, might come back". Google keeps recrawling for
//                   months and the URL lingers in the index.
//   301/308        — "moved here". Sends someone searching an artist's name to
//                   a roster that no longer lists them; Google often treats a
//                   redirect to a page that isn't an equivalent as a soft 404
//                   anyway, so the link equity mostly isn't preserved either.
//   410 Gone       — "deliberately removed, permanently". This is the signal
//                   that gets a URL dropped from the index fastest.
//
// 410 is what we want here. Note the editorial coverage of these artists stays
// live under /magazine — removing an artist from the roster doesn't retract
// the interview, and those articles can still answer name searches.
const GONE_PATHS = new Set(["/mohini-kaur", "/naira-mushtaq"]);

export function middleware(request: NextRequest) {
  if (GONE_PATHS.has(request.nextUrl.pathname)) {
    return new NextResponse(
      "This page has been permanently removed.",
      { status: 410, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }
  return NextResponse.next();
}

export const config = {
  // Only run for the exact paths above — matching broadly would put middleware
  // in front of every request for no benefit.
  matcher: ["/mohini-kaur", "/naira-mushtaq"],
};
