import type { Metadata } from "next";
import { siteConfig } from "./site-config";

export function pageMetadata({
  title,
  description,
  path,
  images,
}: {
  title: string;
  description: string;
  path: string;
  images?: { url: string; width?: number; height?: number }[];
}): Metadata {
  return {
    title,
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
