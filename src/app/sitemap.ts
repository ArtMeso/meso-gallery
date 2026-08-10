import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getArtworks } from "@/lib/artworks";
import { sanityFetch } from "@/sanity/fetch";
import { allArtistSlugsQuery, allArticleSlugsQuery } from "@/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/artists",
    "/artworks",
    "/magazine",
    "/about",
    "/art-advisory",
    "/contact",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));

  const [artworks, artistSlugs, articleSlugs] = await Promise.all([
    getArtworks().catch(() => []),
    sanityFetch<string[]>({ query: allArtistSlugsQuery }).catch(() => []),
    sanityFetch<string[]>({ query: allArticleSlugsQuery }).catch(() => []),
  ]);

  const artworkRoutes: MetadataRoute.Sitemap = artworks.map((artwork) => ({
    url: `${siteConfig.url}/artworks/${artwork.slug}`,
    lastModified: new Date(),
  }));

  const artistRoutes: MetadataRoute.Sitemap = artistSlugs.map((slug) => ({
    url: `${siteConfig.url}/artists/${slug}`,
    lastModified: new Date(),
  }));

  const articleRoutes: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${siteConfig.url}/magazine/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...artworkRoutes, ...artistRoutes, ...articleRoutes];
}
