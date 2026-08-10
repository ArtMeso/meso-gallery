import Link from "next/link";
import type { Artwork } from "@/lib/artworks";
import { formatPrice } from "@/lib/artworks";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <Link href={`/artworks/${artwork.slug}`} className="group block">
      <div className="relative aspect-square w-full overflow-hidden bg-card">
        {artwork.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary external host from the artist's sheet, unknown at build time
          <img
            src={artwork.imageUrl}
            alt={`${artwork.title} by ${artwork.artist}`}
            loading="lazy"
            className="h-full w-full object-contain p-6 transition-transform duration-400 group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <div className="mt-4 space-y-1">
        <p className="font-serif italic text-lg font-light text-ink">
          {artwork.title}
        </p>
        <p className="font-sans text-sm font-light text-ink/70">
          {artwork.artist}
          {artwork.year ? `, ${artwork.year}` : ""}
        </p>
        <p className="font-sans text-xs font-light uppercase tracking-widest text-stone">
          {formatPrice(artwork.price, artwork.currency)}
        </p>
      </div>
    </Link>
  );
}
