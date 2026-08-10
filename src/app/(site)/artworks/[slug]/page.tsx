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

export default async function ArtworkPage({ params }: Props) {
  const artwork = await getArtworkBySlug(params.slug);
  if (!artwork) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: artwork.title,
    image: artwork.imageUrl || undefined,
    description: artwork.bio || undefined,
    brand: { "@type": "Person", name: artwork.artist },
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
