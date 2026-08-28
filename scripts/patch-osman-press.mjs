// One-off patch for Osman Yousefzada's press list:
//
// 1. The entry recorded as "Vogue UK" carries a headline that actually belongs
//    to a Dazed article (verified against the live page: same headline, byline
//    Lexi Manatakis, 7 Jun 2018). Corrects the publication, adds the date and
//    the source URL.
// 2. Renames the Wikipedia entry from the generic "Artist profile" to his name.
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

const result = await client
  .patch("artist-osman-yousefzada")
  .set({
    // pr3 was labelled "Vogue UK" but the headline is Dazed's.
    'press[_key=="pr3"].title':
      "Lexi Manatakis, “Artist Osman Yousefzada’s New Show Is a Personal Reflection on Migration”",
    'press[_key=="pr3"].publication': "Dazed",
    'press[_key=="pr3"].date': "2018-06-07",
    'press[_key=="pr3"].url':
      "https://www.dazeddigital.com/art-photography/article/40287/1/osman-yousefzada-fashion-migration-being-somewhere-else-ikon-gallery",
    // Generic "Artist profile" -> his name.
    'press[_key=="pr9"].title': "Osman Yousefzada",
  })
  .commit();

for (const p of result.press) {
  console.log(
    `${p._key.padEnd(5)} | ${(p.publication || "?").padEnd(22)} | ${(p.date || "no date").padEnd(10)} | ${p.url ? "linked" : "UNLINKED"}`
  );
}
