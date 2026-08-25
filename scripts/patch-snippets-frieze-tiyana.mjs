// Writes search snippets for the two pages with the widest gap between where
// they rank and how often they're clicked.
//
// frieze-new-york-private-collection sits at position 3.4 on 599 impressions
// with a 5.34% CTR against ~10% expected at that position — the ranking is
// fine, the snippet is the problem. It had no metaTitle at all, so Google fell
// back to the 88-char article title ("Frieze New York Private Collection: An
// Intimate Visit with Collector Priya Karani Alibhai"), which truncates long
// before the name people actually search for. 331 of its impressions come from
// "priya karani" variants, so the new title leads with her name.
//
// tiyana-mitchell-archival-painting-family-memory is position 4.8 on 74
// impressions with zero clicks, while its GA4 engagement is the best on the
// site (1,255s average session). Its title ("Between Generations: A
// Conversation with Tiyana Mitchell") buries the artist's name behind an
// abstract phrase; the query is her name.
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.SANITY_API_TOKEN) {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const match = line.match(/^SANITY_API_TOKEN=(.+)$/);
      if (match) process.env.SANITY_API_TOKEN = match[1].trim();
    }
  }
}

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error("Missing SANITY_API_TOKEN. Set it in .env.local and re-run.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "jncu3emy",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const BRAND_SUFFIX = " — MeSo Ventures".length;

const updates = [
  {
    id: "article-frieze-new-york-private-collection",
    metaTitle: "Priya Karani Alibhai's Art Collection",
    metaDescription:
      "Inside collector Priya Karani Alibhai's New York home during Frieze week — the works she lives with, how she acquires, and what guides her collecting.",
  },
  {
    id: "article-tiyana-mitchell-archival-painting-family-memory",
    metaTitle: "Tiyana Mitchell: Painting Family Memory",
    metaDescription:
      "The artist on turning her grandfather's photograph albums — Ramallah, Bethlehem, Marrakesh, the 1920s to the 1970s — into paintings about inheritance.",
  },
];

for (const { id, metaTitle, metaDescription } of updates) {
  const total = metaTitle.length + BRAND_SUFFIX;
  if (total > 62) {
    console.error(`ABORT: "${metaTitle}" renders as ${total} chars, over the display limit.`);
    process.exit(1);
  }
  if (metaDescription.length > 160) {
    console.error(`ABORT: description for ${id} is ${metaDescription.length} chars, over 160.`);
    process.exit(1);
  }

  const r = await client
    .patch(id)
    .setIfMissing({ seo: {} })
    .set({ "seo.metaTitle": metaTitle, "seo.metaDescription": metaDescription })
    .commit();

  console.log(`${r._id}`);
  console.log(`  title: "${r.seo.metaTitle}" -> renders ${total} chars`);
  console.log(`  desc:  ${r.seo.metaDescription.length} chars\n`);
}
