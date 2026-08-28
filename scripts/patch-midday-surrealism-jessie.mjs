// Adds the Mid-Day surrealism piece to Jessie Makinson.
//
// The article covers Mary Pye, Parnika Mittal and Jessie Makinson (confirmed
// by Eirini, who has read the full piece — mid-day.com gates the article body
// from automated access, so the artist list can't be verified from here). It
// was already recorded against Mary and Parnika but had been missed on Jessie.
//
// Metadata matches the entries on the other two artists exactly, including the
// 2026-05-21 date read from the live page:
//   <meta property="article:modified_time" content="2026-05-21 09:31:00 AM">
//   "Updated On: 21 May, 2026 09:31 AM IST | Mumbai | Shriram Iyengar"
//
// Idempotent: re-running will not duplicate the entry.
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

const ARTIST_ID = "artist-jessie-makinson";
const ARTICLE_ID = "23631430";

const ENTRY = {
  // Jessie's keys run pr0..pr22 plus a jm-* set; this follows the jm- prefix
  // so it can't collide with the sequential ones.
  _key: "jm-midday-surrealism",
  _type: "pressEntry",
  title: "Immerse in this exhibition in Mumbai to explore the diversity of surrealism",
  publication: "Mid-Day",
  date: "2026-05-21",
  url: `https://www.mid-day.com/mumbai-guide/things-to-do/article/immerse-in-this-exhibition-in-mumbai-to-explore-the-diversity-of-surrealism-${ARTICLE_ID}`,
};

const doc = await client.getDocument(ARTIST_ID);
if (!doc) {
  console.error(`MISSING: ${ARTIST_ID}`);
  process.exit(1);
}

const press = doc.press || [];

if (press.some((p) => typeof p.url === "string" && p.url.includes(ARTICLE_ID))) {
  console.log(`${doc.name}: already recorded, skipping`);
  process.exit(0);
}
if (press.some((p) => p._key === ENTRY._key)) {
  console.error(`${doc.name}: key "${ENTRY._key}" already in use — resolve by hand`);
  process.exit(1);
}

const result = await client
  .patch(ARTIST_ID)
  .setIfMissing({ press: [] })
  .append("press", [ENTRY])
  .commit();

console.log(`${doc.name}: added — press entries ${press.length} -> ${result.press.length}`);
