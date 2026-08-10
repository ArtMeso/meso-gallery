import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ArtworksExplorer } from "@/components/artworks/artworks-explorer";
import { getArtworks, getFilterOptions } from "@/lib/artworks";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Artworks",
  description:
    "Browse the full MeSo Ventures catalogue of available contemporary artworks — filter by artist, medium, country, size and type.",
  path: "/artworks",
});

export const revalidate = 120;

export default async function ArtworksPage() {
  const artworks = await getArtworks().catch(() => []);
  const filterOptions = getFilterOptions(artworks);

  return (
    <div className="py-16">
      <Container>
        <div className="mb-12">
          <p className="eyebrow mb-4">Catalogue</p>
          <h1 className="font-serif text-4xl italic font-light text-ink sm:text-5xl">
            Artworks
          </h1>
        </div>
        <ArtworksExplorer artworks={artworks} filterOptions={filterOptions} />
      </Container>
    </div>
  );
}
