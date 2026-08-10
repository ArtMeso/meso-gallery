import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // `false` disables the CDN so authoring changes in Studio show up
  // immediately; the pages that use this client are revalidated on a
  // timer/webhook anyway (see fetch calls' `next.revalidate`).
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});
