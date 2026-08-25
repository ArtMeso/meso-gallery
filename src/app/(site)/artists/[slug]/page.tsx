import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ArtworkCard } from "@/components/cards/artwork-card";
import { RichText } from "@/components/portable-text";
import { sanityFetch } from "@/sanity/fetch";
import { artistBySlugQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import type { ArtistFull } from "@/sanity/types";
import { getArtworksByArtistName } from "@/lib/artworks";
import { mailtoHref, siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 120;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artist = await sanityFetch<ArtistFull | null>({
    query: artistBySlugQuery,
    params: { slug: params.slug },
  }).catch(() => null);
  if (!artist) return {};

  return pageMetadata({
    title: artist.name,
    description:
      artist.practice ||
      `${artist.name}${artist.location ? `, ${artist.location}` : ""} — represented by MeSo Ventures.`,
    path: `/artists/${artist.slug}`,
    images: artist.portrait
      ? [{ url: urlForImage(artist.portrait).width(1200).height(630).url() }]
      : undefined,
  });
}

export default async function ArtistPage({ params }: Props) {
  const artist = await sanityFetch<ArtistFull | null>({
    query: artistBySlugQuery,
    params: { slug: params.slug },
  }).catch(() => null);

  if (!artist) notFound();

  const works = await getArtworksByArtistName(artist.name).catch(() => []);
  const enquireHref = mailtoHref({
    subject: `Enquiry: ${artist.name}`,
    body: `Hello MeSo Ventures,\n\nI would like to enquire about the work of ${artist.name}.\n\n`,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name,
    url: `${siteConfig.url}/artists/${artist.slug}`,
    image: artist.portrait
      ? urlForImage(artist.portrait).width(1200).height(1500).url()
      : undefined,
    description: artist.practice || undefined,
    jobTitle: artist.discipline || "Artist",
    homeLocation: artist.location
      ? { "@type": "Place", name: artist.location }
      : undefined,
    memberOf: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };

  return (
    <div className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-card">
            {artist.portrait ? (
              <Image
                src={urlForImage(artist.portrait).width(900).height(1125).url()}
                alt={artist.name}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>

          <div>
            <h1 className="font-serif text-4xl italic font-light text-ink sm:text-5xl">
              {artist.name}
            </h1>
            {artist.location || artist.discipline ? (
              <p className="mt-2 font-sans text-sm font-light text-stone">
                {[artist.location, artist.discipline].filter(Boolean).join(" — ")}
              </p>
            ) : null}

            {artist.practice ? (
              <p className="mt-6 font-sans text-sm font-light leading-relaxed text-ink/70">
                {artist.practice}
              </p>
            ) : null}

            {artist.bio ? (
              <div className="mt-8">
                <RichText value={artist.bio} />
              </div>
            ) : null}

            {artist.education && artist.education.length > 0 ? (
              <div className="mt-8">
                <p className="eyebrow mb-3">Education</p>
                <ul className="space-y-1 font-sans text-sm font-light text-ink/70">
                  {artist.education.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {artist.awards && artist.awards.length > 0 ? (
              <div className="mt-8">
                <p className="eyebrow mb-3">Awards &amp; Residencies</p>
                <ul className="space-y-1 font-sans text-sm font-light text-ink/70">
                  {artist.awards.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {artist.teaching && artist.teaching.length > 0 ? (
              <div className="mt-8">
                <p className="eyebrow mb-3">Teaching &amp; Academic Engagement</p>
                <ul className="space-y-1 font-sans text-sm font-light text-ink/70">
                  {artist.teaching.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Button href={enquireHref} variant="solid" className="mt-10">
              Enquire
            </Button>
            <p className="mt-4 font-sans text-xs font-light text-ink/50">
              New to collecting?{" "}
              <Link
                href="/magazine/how-to-start-an-art-collection"
                className="underline underline-offset-4 hover:text-ink"
              >
                Read our guide to starting an art collection
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-24 border-t border-mist pt-16">
          <h2 className="mb-10 font-serif text-2xl italic font-light text-ink">
            Selected Works
          </h2>
          {works.length > 0 ? (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {works.map((artwork) => (
                <ArtworkCard key={artwork.slug} artwork={artwork} />
              ))}
            </div>
          ) : (
            <EmptyState>No works currently listed for this artist.</EmptyState>
          )}
        </div>

        {artist.exhibitions && artist.exhibitions.length > 0 ? (
          <div className="mt-24 border-t border-mist pt-16">
            <h2 className="mb-10 font-serif text-2xl italic font-light text-ink">
              Exhibition History
            </h2>
            {(
              [
                ["Solo", "Solo Shows"],
                ["Group", "Group Shows"],
              ] as const
            ).map(([type, heading]) => {
              const entries = artist.exhibitions!.filter((entry) => entry.type === type);
              if (entries.length === 0) return null;
              return (
                <div key={type} className="mb-10 last:mb-0">
                  <p className="eyebrow mb-3">{heading}</p>
                  <ul className="space-y-4 font-sans text-sm font-light text-ink/70">
                    {entries.map((entry, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="w-16 shrink-0 text-stone">{entry.year}</span>
                        <span>
                          {entry.title}
                          {entry.venue ? `, ${entry.venue}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {(() => {
              const untyped = artist.exhibitions!.filter(
                (entry) => entry.type !== "Solo" && entry.type !== "Group"
              );
              if (untyped.length === 0) return null;
              return (
                <div className="mb-10 last:mb-0">
                  <p className="eyebrow mb-3">Other</p>
                  <ul className="space-y-4 font-sans text-sm font-light text-ink/70">
                    {untyped.map((entry, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="w-16 shrink-0 text-stone">{entry.year}</span>
                        <span>
                          {entry.title}
                          {entry.venue ? `, ${entry.venue}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>
        ) : null}

        {artist.press && artist.press.length > 0 ? (
          <div className="mt-24 border-t border-mist pt-16">
            <h2 className="mb-10 font-serif text-2xl italic font-light text-ink">
              Press &amp; Publications
            </h2>
            <ul className="space-y-4 font-sans text-sm font-light text-ink/70">
              {[...artist.press]
                .sort((a, b) => {
                  if (!a.date) return 1;
                  if (!b.date) return -1;
                  return b.date.localeCompare(a.date);
                })
                .map((entry, i) => (
                  <li key={i}>
                    {entry.url ? (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="hover:text-ink underline underline-offset-4"
                      >
                        {entry.title}
                      </a>
                    ) : (
                      <span>{entry.title}</span>
                    )}
                    {entry.publication ? `, ${entry.publication}` : ""}
                    {entry.date ? ` — ${format(new Date(entry.date), "yyyy")}` : ""}
                  </li>
                ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
