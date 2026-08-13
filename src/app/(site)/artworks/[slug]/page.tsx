import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ArtworkDetail } from "@/components/artworks/artwork-detail";
import { getArtworkBySlug } from "@/lib/artworks";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 120;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artwork = await getArtworkBySlug(params.slug);
  if (!artwork) return {};

  const title = `${artwork.title} — ${artwork.artist}`;
  const description = artwork.bio
    ? artwork.bio.slice(0, 200)
    : `${artwork.title} by ${artwork.artist}, ${artwork.year}. ${artwork.mediumFull || artwork.medium}.`;

  return pageMetadata({
    title,
    description,
    path: `/artworks/${artwork.slug}`,
    images: artwork.imageUrl ? [{ url: artwork.imageUrl }] : undefined,
  });
}

// Sheet dims are free text like "20 x 40 cm" — parse width/height when the
// format matches, otherwise omit rather than guess.
function parseDims(dims: string): { width?: string; height?: string } {
  const match = dims.match(/^\s*([\d.]+)\s*x\s*([\d.]+)\s*(\D+)?\s*$/i);
  if (!match) return {};
  const [, width, height, unit] = match;
  const suffix = unit ? ` ${unit.trim()}` : "";
  return { width: `${width}${suffix}`, height: `${height}${suffix}` };
}

export default async function ArtworkPage({ params }: Props) {
  const artwork = await getArtworkBySlug(params.slug);
  if (!artwork) notFound();

  const { width, height } = artwork.dims ? parseDims(artwork.dims) : {};

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title,
    url: `${siteConfig.url}/artworks/${artwork.slug}`,
    image: artwork.imageUrl || undefined,
    description: artwork.bio || undefined,
    creator: {
      "@type": "Person",
      name: artwork.artist,
      url: `${siteConfig.url}/artists/${artwork.artistSlug}`,
    },
    dateCreated: artwork.year || undefined,
    artform: artwork.type || undefined,
    artMedium: artwork.mediumFull || artwork.medium || undefined,
    width: width ? { "@type": "Distance", name: width } : undefined,
    height: height ? { "@type": "Distance", name: height } : undefined,
    ...(artwork.price
      ? {
          offers: {
            "@type": "Offer",
            price: artwork.price,
            priceCurrency: artwork.currency || "GBP",
            availability: "https://schema.org/InStock",
            url: `${siteConfig.url}/artworks/${artwork.slug}`,
          },
        }
      : {}),
  };

  return (
    <div className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <ArtworkDetail artwork={artwork} />
      </Container>
    </div>
  );
}
