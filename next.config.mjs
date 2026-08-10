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
    ];
  },
};

export default nextConfig;
