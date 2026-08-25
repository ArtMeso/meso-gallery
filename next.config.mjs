/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  // Permanent redirects from the old Squarespace site's URLs, so existing
  // backlinks (press mentions, directories) keep working after migration.
  // /, /about, /contact, /magazine and /magazine/<slug> are unchanged and
  // need no redirect. Old artwork pages didn't exist as individual URLs
  // (Squarespace used a lightbox on /artworks), so nothing to redirect
  // there. Artist slugs below were confirmed against the old site.
  async redirects() {
    const oldArtistSlugs = [
      "jessie-makinson",
      "parnika-mittal",
      "tiyana-mitchell",
      "mary-pye",
      "osman-yousefzada",
      "kubra-aliyeva",
      "tallulah-hutson",
      "lydia-hamblet",
      "mengmeng-zhang",
      "joya-mukerjee-logue",
      "chiedu-okonta",
      // Conor Murgatroyd isn't included — added after the old site, no
      // legacy URL to preserve.
    ];

    return [
      {
        source: "/artists-exhibitions-works-biographies",
        destination: "/artists",
        permanent: true,
      },
      {
        source: "/news-and-press",
        destination: "/magazine",
        permanent: true,
      },
      {
        source: "/news-and-press/mythologies-of-colour-soho-house-mumbai-2026",
        destination: "/magazine/mythologies-of-colour-soho-house-mumbai-2026",
        permanent: true,
      },
      {
        source:
          "/news-and-press/meso-ventures-and-bulgari-present-what-light-remains-tiyana-mitchell",
        destination:
          "/magazine/meso-ventures-and-bulgari-present-what-light-remains-tiyana-mitchell",
        permanent: true,
      },
      ...oldArtistSlugs.map((slug) => ({
        source: `/${slug}`,
        destination: `/artists/${slug}`,
        permanent: true,
      })),
      // Squarespace auto-generated tag/category archive pages — no
      // equivalent on the new site, send them to the magazine index
      // instead of leaving a 404.
      {
        source: "/magazine/tag/:tag*",
        destination: "/magazine",
        permanent: true,
      },
      // Stray old Squarespace URLs (an alternate homepage slug, an unused
      // draft page) turning up in Search Console's 404 report.
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/home-1",
        destination: "/",
        permanent: true,
      },
      {
        source: "/new-page",
        destination: "/",
        permanent: true,
      },
      // Former roster artist, dropped before the migration — no page to
      // send this to, so land on the roster index instead of a 404.
      {
        source: "/rex-southwick",
        destination: "/artists",
        permanent: true,
      },
      // Old Squarespace India Art Fair recap page, flagged in Search
      // Console for a Squarespace video embed that Google can't index
      // (blob: URL). Superseded by the current article.
      {
        source: "/india-art-fair-delhi",
        destination: "/magazine/india-art-fair-2026-new-delhi-art-week-delhi-2026",
        permanent: true,
      },
      // Standalone exhibition pages from the old site. There is no exhibition
      // route on the new site (the `exhibition` Sanity type is registered but
      // has no documents and nothing renders it), and the editorial coverage
      // is better contextualised than a bare exhibition page would be, so
      // these point at the articles that already carry the content rather
      // than being rebuilt.
      {
        // The India Art Fair diary carries a full "Gesture of Memories"
        // section — heading, description and all.
        source: "/gesture-of-memories",
        destination: "/magazine/india-art-fair-2026-new-delhi-art-week-delhi-2026",
        permanent: true,
      },
      {
        source: "/the-mythologies-of-colour-soho-house-mumbai",
        destination: "/magazine/mythologies-of-colour-soho-house-mumbai-2026",
        permanent: true,
      },
      {
        // No article covers this show specifically, so it lands on the
        // magazine index. Retarget if the matching piece is written.
        source: "/seams-veils-bodies-archives-and-the-threshold-of-seeing",
        destination: "/magazine",
        permanent: true,
      },
      // Artists dropped from the roster (/mohini-kaur, /naira-mushtaq) are
      // deliberately NOT redirected — they return 410 Gone from
      // src/middleware.ts so Google drops them from the index rather than
      // following a redirect to a roster that no longer lists them.
      //
      // Squarespace tag and category archives under the old news section.
      // The section itself already redirects above; these sub-paths didn't.
      {
        source: "/news-and-press/tag/:tag*",
        destination: "/magazine",
        permanent: true,
      },
      {
        source: "/news-and-press/category/:category*",
        destination: "/magazine",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
