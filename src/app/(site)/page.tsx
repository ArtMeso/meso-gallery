import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ArtworkCard } from "@/components/cards/artwork-card";
import { ArticleCard } from "@/components/cards/article-card";
import { getArtworks } from "@/lib/artworks";
import { sanityFetch } from "@/sanity/fetch";
import { featuredArtistQuery, latestArticlesQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import type { ArticleCard as ArticleCardType, ArtistFull } from "@/sanity/types";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

export const revalidate = 120;

export default async function Home() {
  const [artworks, featuredArtist, latestArticles] = await Promise.all([
    getArtworks().catch((e) => {
      console.error("Failed to load artworks sheet:", e);
      return [];
    }),
    sanityFetch<ArtistFull | null>({ query: featuredArtistQuery }).catch((e) => {
      console.error("Failed to load featured artist:", e);
      return null;
    }),
    sanityFetch<ArticleCardType[]>({ query: latestArticlesQuery, params: { limit: 3 } }).catch(
      (e) => {
        console.error("Failed to load latest articles:", e);
        return [];
      }
    ),
  ]);

  const featuredWorks = artworks.slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ArtGallery",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    sameAs: [siteConfig.instagram],
    address: siteConfig.locations.map((location) => ({
      "@type": "PostalAddress",
      addressLocality: location,
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="flex min-h-[80vh] items-center justify-center border-b border-mist bg-cream">
        <Container className="text-center">
          <p className="eyebrow mb-6">{siteConfig.locations.join(" · ")}</p>
          <h1 className="font-serif text-5xl italic font-light tracking-wide text-ink sm:text-6xl md:text-7xl">
            MeSo Ventures
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-sans text-sm font-light text-ink/70">
            {siteConfig.description}
          </p>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="mb-12 flex items-end justify-between gap-6">
            <h2 className="font-serif text-3xl italic font-light text-ink">
              Featured Works
            </h2>
            <Link
              href="/artworks"
              className="font-sans text-xs font-light uppercase tracking-widest text-ink/70 hover:text-ink"
            >
              View all works
            </Link>
          </div>
          {featuredWorks.length > 0 ? (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {featuredWorks.map((artwork) => (
                <ArtworkCard key={artwork.slug} artwork={artwork} />
              ))}
            </div>
          ) : (
            <EmptyState>
              Works are temporarily unavailable — please check back shortly.
            </EmptyState>
          )}
        </Container>
      </section>

      <section className="border-y border-mist bg-warm py-24">
        <Container className="text-center">
          <p className="mx-auto max-w-2xl font-serif text-2xl italic font-light leading-relaxed text-ink sm:text-3xl">
            MeSo Ventures represents a considered constellation of emerging and
            established contemporary artists across London and Dubai. We
            advise collectors across the UAE and India with the same rigour
            we bring to the artists we champion.
          </p>
        </Container>
      </section>

      {featuredArtist ? (
        <section className="py-24">
          <Container className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-card">
              {featuredArtist.portrait ? (
                <Image
                  src={urlForImage(featuredArtist.portrait).width(900).height(1125).url()}
                  alt={featuredArtist.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div>
              <p className="eyebrow mb-4">Artist Spotlight</p>
              <h2 className="font-serif text-4xl italic font-light text-ink">
                {featuredArtist.name}
              </h2>
              {featuredArtist.location || featuredArtist.discipline ? (
                <p className="mt-2 font-sans text-sm font-light text-stone">
                  {[featuredArtist.location, featuredArtist.discipline]
                    .filter(Boolean)
                    .join(" — ")}
                </p>
              ) : null}
              {featuredArtist.practice ? (
                <p className="mt-6 max-w-md font-sans text-sm font-light leading-relaxed text-ink/70">
                  {featuredArtist.practice}
                </p>
              ) : null}
              <Button href={`/artists/${featuredArtist.slug}`} variant="outline" className="mt-8">
                View Artist
              </Button>
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-t border-mist py-24">
        <Container>
          <div className="mb-12 flex items-end justify-between gap-6">
            <h2 className="font-serif text-3xl italic font-light text-ink">
              MeSo Mag
            </h2>
            <Link
              href="/magazine"
              className="font-sans text-xs font-light uppercase tracking-widest text-ink/70 hover:text-ink"
            >
              Read the magazine
            </Link>
          </div>
          {latestArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState>New editorial coverage is on its way.</EmptyState>
          )}
        </Container>
      </section>
    </div>
  );
}
