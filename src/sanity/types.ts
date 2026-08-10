import type { Image, PortableTextBlock } from "sanity";

export type ArtistCard = {
  _id: string;
  name: string;
  slug: string;
  location?: string;
  discipline?: string;
  portrait?: Image;
  featured?: boolean;
};

export type ExhibitionEntry = {
  year?: string;
  title?: string;
  venue?: string;
  type?: "Solo" | "Group";
};

export type PressEntry = {
  title?: string;
  publication?: string;
  date?: string;
  url?: string;
};

export type ArtistFull = ArtistCard & {
  bio?: PortableTextBlock[];
  practice?: string;
  education?: string[];
  exhibitions?: ExhibitionEntry[];
  collections?: string[];
  awards?: string[];
  teaching?: string[];
  press?: PressEntry[];
};

export const ARTICLE_CATEGORIES = [
  "Market Intelligence",
  "Artist Spotlight",
  "Collecting Guide",
  "Exhibition Review",
  "Art Fair",
  "Press Release",
  "Events",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export type ArticleCard = {
  _id: string;
  title: string;
  slug: string;
  author?: string;
  date: string;
  category: ArticleCategory;
  excerpt?: string;
  featuredImage?: Image;
};

export type ArticleFull = ArticleCard & {
  body?: PortableTextBlock[];
  seo?: { metaTitle?: string; metaDescription?: string };
  relatedArtists?: ArtistCard[];
};

export type TeamMember = {
  _id: string;
  name: string;
  role?: string;
  bio?: string;
  portrait?: Image;
};
