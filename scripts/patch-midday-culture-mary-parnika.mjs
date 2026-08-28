// Adds the Mid-Day "Mumbai culture" round-up to Mary Pye and Parnika Mittal.
//
// Both appear in its "The city's their canvas" section, covering the Abode
// residency — the same programme as the Hospemag piece already recorded
// against both artists (2026-08-24).
//
// Metadata was read from the live page in a browser, not guessed: mid-day.com
// blocks our crawler, so WebFetch returns nothing usable there.
//
//   headline  — the on-page H1, which also matches the URL slug. The <title>
//               and og:title carry a different, SEO-tuned variant ("Mumbai's
//               cultural scene: Laufey fans, artists and DJ Sartek take over
//               the city"); the H1 is the stabler identifier.
//   url       — the page's own rel=canonical, which matches the shared link.
//   date      — the page exposes only "Updated On: 26 August, 2026 08:31 AM
//               IST" and no separate publication date. For a same-day culture
//               round-up that is the publication date. Correct it here if the
//               piece turns out to have run earlier.
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

const URL =
  "https://www.mid-day.com/mumbai/mumbai-news/article/mumbai-culture-laufey-fans-mind-reading-show-and-artists-make-city-headlines-23646661";

const ENTRY = {
  // Parnika already carries a `pr-midday-2026` key for the January surrealism
  // piece, so this one needs a distinct key on both documents.
  _key: "pr-midday-culture-2026",
  _type: "pressEntry",
  title: "Mumbai culture: Laufey fans, mind-reading show and artists make city headlines",
  publication: "Mid-Day",
  date: "2026-08-26",
  url: URL,
};

const ARTIST_IDS = ["artist-mary-pye", "artist-parnika-mittal"];

for (const id of ARTIST_IDS) {
  const doc = await client.getDocument(id);
  if (!doc) {
    console.error(`MISSING: ${id}`);
    continue;
  }

  const press = doc.press || [];

  // Match on the article id in the URL rather than the full string, so a
  // trailing slash or an http/https difference still counts as a duplicate.
  if (press.some((p) => typeof p.url === "string" && p.url.includes("23646661"))) {
    console.log(`${doc.name}: already recorded, skipping`);
    continue;
  }

  // Guard against a key collision with anything added in the Studio meanwhile.
  if (press.some((p) => p._key === ENTRY._key)) {
    console.error(`${doc.name}: key "${ENTRY._key}" already in use — resolve by hand`);
    continue;
  }

  const result = await client
    .patch(id)
    .setIfMissing({ press: [] })
    .append("press", [ENTRY])
    .commit();

  console.log(`${doc.name}: added — press entries ${press.length} -> ${result.press.length}`);
}
