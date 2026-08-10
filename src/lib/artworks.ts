import { parseDelimited, rowsToObjects } from "./sheet-parser";
import { slugify } from "./utils";

const SHEET_TSV_URL =
  process.env.NEXT_PUBLIC_ARTWORKS_SHEET_URL ||
  "https://docs.google.com/spreadsheets/d/11bu_TDQ089C_O46hWMEdByBdXmufJCpe93k0Yas9IpY/export?format=tsv&gid=0";

export type Artwork = {
  slug: string;
  artistSlug: string;
  title: string;
  artist: string;
  medium: string;
  mediumFull: string;
  country: string;
  type: string;
  size: string;
  dims: string;
  year: string;
  price: number | null;
  currency: string;
  bio: string;
  imageUrl: string;
};

// Sheet header names, normalised (lowercased, spaces stripped) -> lookup key
const COLUMN_MAP: Record<string, keyof Artwork | "skip"> = {
  title: "title",
  artist: "artist",
  medium: "medium",
  mediumfull: "mediumFull",
  country: "country",
  basedin: "country",
  type: "type",
  size: "size",
  dims: "dims",
  year: "year",
  price: "price",
  currency: "currency",
  bio: "bio",
  imageurl: "imageUrl",
};

function normaliseHeader(header: string) {
  return header.toLowerCase().replace(/[^a-z]/g, "");
}

function parsePrice(raw: string): number | null {
  if (!raw) return null;
  const numeric = Number(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function toArtwork(record: Record<string, string>, index: number): Artwork {
  const mapped: Partial<Record<keyof Artwork, string>> = {};
  for (const [rawHeader, value] of Object.entries(record)) {
    const key = COLUMN_MAP[normaliseHeader(rawHeader)];
    if (key && key !== "skip") mapped[key] = value;
  }

  // Cells are always strings (possibly ""), never undefined, so fallbacks
  // must use `||` — `??` would never trigger on an empty cell.
  const title = mapped.title || "Untitled";
  const artist = mapped.artist || "Unknown Artist";
  const artistSlug = slugify(artist);
  const titleSlug = slugify(title) || `work-${index}`;

  return {
    slug: `${artistSlug}-${titleSlug}`,
    artistSlug,
    title,
    artist,
    medium: mapped.medium ?? "",
    mediumFull: mapped.mediumFull || mapped.medium || "",
    country: mapped.country ?? "",
    type: mapped.type ?? "",
    size: mapped.size ?? "",
    dims: mapped.dims ?? "",
    year: mapped.year ?? "",
    price: parsePrice(mapped.price ?? ""),
    currency: mapped.currency ?? "",
    bio: mapped.bio ?? "",
    imageUrl: mapped.imageUrl ?? "",
  };
}

function dedupeSlugs(artworks: Artwork[]): Artwork[] {
  const seen = new Map<string, number>();
  return artworks.map((artwork) => {
    const count = seen.get(artwork.slug) ?? 0;
    seen.set(artwork.slug, count + 1);
    return count === 0 ? artwork : { ...artwork, slug: `${artwork.slug}-${count + 1}` };
  });
}

export async function getArtworks(): Promise<Artwork[]> {
  // Next's fetch cache (below) already handles both request memoization
  // within a render pass and timed revalidation across requests — no need
  // for a second cache layer on top.
  const res = await fetch(SHEET_TSV_URL, { next: { revalidate: 120 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch artworks sheet: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  const rows = parseDelimited(text, "\t");
  const objects = rowsToObjects(rows);
  return dedupeSlugs(objects.map(toArtwork));
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | undefined> {
  const artworks = await getArtworks();
  return artworks.find((a) => a.slug === slug);
}

export async function getArtworksByArtistName(artistName: string): Promise<Artwork[]> {
  const artworks = await getArtworks();
  const targetSlug = slugify(artistName);
  return artworks.filter((a) => a.artistSlug === targetSlug);
}

export type ArtworkFilterOptions = {
  artists: string[];
  mediums: string[];
  countries: string[];
  sizes: string[];
  types: string[];
};

export function getFilterOptions(artworks: Artwork[]): ArtworkFilterOptions {
  const uniqueSorted = (values: (string | undefined)[]) =>
    Array.from(new Set(values.filter((v): v is string => Boolean(v && v.trim())))).sort(
      (a, b) => a.localeCompare(b)
    );

  return {
    artists: uniqueSorted(artworks.map((a) => a.artist)),
    mediums: uniqueSorted(artworks.map((a) => a.medium)),
    countries: uniqueSorted(artworks.map((a) => a.country)),
    sizes: uniqueSorted(artworks.map((a) => a.size)),
    types: uniqueSorted(artworks.map((a) => a.type)),
  };
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  AED: "AED ",
};

export function formatPrice(price: number | null, currency: string): string {
  if (price === null) return "Pricing on request";
  const code = currency.trim().toUpperCase();
  const symbol = CURRENCY_SYMBOLS[code] ?? (code ? `${code} ` : "");
  return `${symbol}${price.toLocaleString("en-GB")}`;
}
