import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { sanityFetch } from "@/sanity/fetch";
import { allArtistsQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import type { ArtistCard } from "@/sanity/types";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Artists",
  description:
    "The artists represented by MeSo Ventures — an international roster working across painting, sculpture, textile and installation.",
  path: "/artists",
});

export const revalidate = 120;

export default async function ArtistsPage() {
  const artists = await sanityFetch<ArtistCard[]>({ query: allArtistsQuery }).catch(
    () => []
  );

  return (
    <div className="py-16">
      <Container>
        <div className="mb-12">
          <p className="eyebrow mb-4">Roster</p>
          <h1 className="font-serif text-4xl italic font-light text-ink sm:text-5xl">
            Artists
          </h1>
        </div>

        {artists.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-8 gap-y-14 sm:grid-cols-3 lg:grid-cols-4">
            {artists.map((artist) => (
              <Link
                key={artist._id}
                href={`/artists/${artist.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-card">
                  {artist.portrait ? (
                    <Image
                      src={urlForImage(artist.portrait).width(600).height(750).url()}
                      alt={artist.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-400 group-hover:scale-[1.02]"
                    />
                  ) : null}
                </div>
                <p className="mt-4 font-serif text-lg italic font-light text-ink">
                  {artist.name}
                </p>
                {artist.location || artist.discipline ? (
                  <p className="font-sans text-xs font-light text-stone">
                    {[artist.location, artist.discipline].filter(Boolean).join(" — ")}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState>Artist profiles are being added — please check back shortly.</EmptyState>
        )}
      </Container>
    </div>
  );
}
