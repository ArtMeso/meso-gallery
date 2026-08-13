import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "./env";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: Image) {
  return imageBuilder.image(source).auto("format").fit("max");
}

// Sanity asset refs encode their original pixel size, e.g.
// "image-abc123-1600x900-jpg" — read it so callers can size a container to
// the image's real aspect ratio instead of guessing (and cropping).
export function imageDimensions(source: Image): { width: number; height: number } | null {
  const ref = (source as { asset?: { _ref?: string } })?.asset?._ref;
  const match = ref?.match(/-(\d+)x(\d+)-/);
  if (!match) return null;
  return { width: Number(match[1]), height: Number(match[2]) };
}
