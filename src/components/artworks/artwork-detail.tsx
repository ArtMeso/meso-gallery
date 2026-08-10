import Link from "next/link";
import type { Artwork } from "@/lib/artworks";
import { formatPrice } from "@/lib/artworks";
import { Button } from "@/components/ui/button";
import { mailtoHref } from "@/lib/site-config";

export function ArtworkDetail({ artwork }: { artwork: Artwork }) {
  const enquireHref = mailtoHref({
    subject: `Enquiry: ${artwork.title} by ${artwork.artist}`,
    body: `Hello MeSo Ventures,\n\nI would like to enquire about "${artwork.title}" (${artwork.year}) by ${artwork.artist}.\n\n`,
  });

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-card">
        {artwork.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary external host from the artist's sheet, unknown at build time
          <img
            src={artwork.imageUrl}
            alt={`${artwork.title} by ${artwork.artist}`}
            className="h-full w-full object-contain p-8"
          />
        ) : null}
      </div>

      <div className="flex flex-col">
        <p className="font-serif text-3xl italic font-light text-ink sm:text-4xl">
          {artwork.title}
        </p>
        <Link
          href={`/artists/${artwork.artistSlug}`}
          className="mt-2 font-sans text-sm font-light text-ink/70 hover:text-ink"
        >
          {artwork.artist}
          {artwork.year ? `, ${artwork.year}` : ""}
        </Link>

        <dl className="mt-8 space-y-3 font-sans text-sm font-light text-ink/70">
          {artwork.mediumFull || artwork.medium ? (
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 text-stone">Medium</dt>
              <dd>{artwork.mediumFull || artwork.medium}</dd>
            </div>
          ) : null}
          {artwork.dims ? (
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 text-stone">Dimensions</dt>
              <dd>{artwork.dims}</dd>
            </div>
          ) : null}
          {artwork.type ? (
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 text-stone">Type</dt>
              <dd>{artwork.type}</dd>
            </div>
          ) : null}
        </dl>

        <p className="mt-6 font-sans text-xs font-light uppercase tracking-widest text-stone">
          {formatPrice(artwork.price, artwork.currency)}
        </p>

        {artwork.bio ? (
          <p className="mt-8 max-w-md font-sans text-sm font-light leading-relaxed text-ink/70">
            {artwork.bio}
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href={enquireHref} variant="solid">
            Enquire about this work
          </Button>
          <Button href={`/artists/${artwork.artistSlug}`} variant="text">
            Learn more about the artist
          </Button>
        </div>
      </div>
    </div>
  );
}
