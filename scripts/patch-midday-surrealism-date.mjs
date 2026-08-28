// Corrects the date on the Mid-Day surrealism piece for both artists.
//
// It was recorded as 2026-01-01 — a placeholder, not a real date. The live
// page states 21 May 2026 twice and consistently:
//
//   <meta property="article:modified_time" content="2026-05-21 09:31:00 AM">
//   "Updated On: 21 May, 2026 09:31 AM IST | Mumbai | Shriram Iyengar"
//
// mid-day.com blocks our crawler, so this was read in a browser rather than
// via WebFetch.
//
// Patches are _key-scoped so a concurrent Studio edit to any other press entry
// isn't clobbered, and the URL is re-checked before writing in case the entry
// moved.
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

const CORRECT_DATE = "2026-05-21";
const ARTICLE_ID = "23631430";

const targets = [
  { id: "artist-mary-pye" },
  { id: "artist-parnika-mittal" },
];

for (const { id } of targets) {
  const doc = await client.getDocument(id);
  if (!doc) {
    console.error(`MISSING: ${id}`);
    continue;
  }

  // Find by URL rather than by hard-coded _key: the two artists use different
  // keys for this same article (pr0 vs pr-midday-2026).
  const entry = (doc.press || []).find(
    (p) => typeof p.url === "string" && p.url.includes(ARTICLE_ID)
  );

  if (!entry) {
    console.error(`${doc.name}: surrealism entry not found — skipping`);
    continue;
  }
  if (entry.date === CORRECT_DATE) {
    console.log(`${doc.name}: already ${CORRECT_DATE}, skipping`);
    continue;
  }

  await client
    .patch(id)
    .set({ [`press[_key=="${entry._key}"].date`]: CORRECT_DATE })
    .commit();

  console.log(`${doc.name}: [${entry._key}] ${entry.date} -> ${CORRECT_DATE}`);
}
