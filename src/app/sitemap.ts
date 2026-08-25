import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getArtworks } from "@/lib/artworks";
import { sanityFetch } from "@/sanity/fetch";
import { artistSitemapEntriesQuery, articleSitemapEntriesQuery } from "@/sanity/queries";

type SitemapEntry = { slug: string; _updatedAt: string };

// `lastModified` is deliberately omitted where we cannot know it. Stamping
// `new Date()` on every URL tells Google all 67 pages changed today, every
// day — a claim that is false on almost all of them, and one Google responds
// to by ignoring <lastmod> for the whole property. Sanity-backed routes carry
// a real `_updatedAt`; static routes and the sheet-backed artworks have no
// per-URL timestamp to report, so they report none.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/artists",
    "/artworks",
    "/magazine",
    "/about",
    "/art-advisory",
    "/collection-building",
    "/tax-efficient-art-acquisition",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
  }));

  const [artworks, artistEntries, articleEntries] = await Promise.all([
    getArtworks().catch(() => []),
    sanityFetch<SitemapEntry[]>({ query: artistSitemapEntriesQuery }).catch(() => []),
    sanityFetch<SitemapEntry[]>({ query: articleSitemapEntriesQuery }).catch(() => []),
  ]);

  const artworkRoutes: MetadataRoute.Sitemap = artworks.map((artwork) => ({
    url: `${siteConfig.url}/artworks/${artwork.slug}`,
  }));

  const artistRoutes: MetadataRoute.Sitemap = artistEntries.map((entry) => ({
    url: `${siteConfig.url}/artists/${entry.slug}`,
    lastModified: new Date(entry._updatedAt),
  }));

  const articleRoutes: MetadataRoute.Sitemap = articleEntries.map((entry) => ({
    url: `${siteConfig.url}/magazine/${entry.slug}`,
    lastModified: new Date(entry._updatedAt),
  }));

  return [...staticRoutes, ...artworkRoutes, ...artistRoutes, ...articleRoutes];
}
