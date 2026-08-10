import type { Metadata } from "next";
import { siteConfig } from "./site-config";

export function pageMetadata({
  title,
  description,
  path,
  images,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  images?: { url: string; width?: number; height?: number }[];
  // Skip the root layout's "%s — MeSo Ventures" template — use when `title`
  // is already the complete title (e.g. the homepage, where siteConfig.title
  // already ends in "— MeSo Ventures").
  absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${path}`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
