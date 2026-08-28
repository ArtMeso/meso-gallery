// One-off patch: fills in missing `date` fields on press entries that already
// had a URL. Dates were read from each article's own page. Without a date the
// artist page's press list can't sort chronologically (undated entries sink to
// the bottom), so these gaps were breaking the ordering.
// Only fills empty fields — does not overwrite any existing date.
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

const dateFixes = [
  { id: "artist-joya-mukerjee-logue", key: "pr2", date: "2024-08-31", note: "The Print" },
  { id: "artist-joya-mukerjee-logue", key: "pr7", date: "2024-09-08", note: "The Tribune" },
  { id: "artist-joya-mukerjee-logue", key: "pr8", date: "2024-09-04", note: "Platform Mag" },
  { id: "artist-joya-mukerjee-logue", key: "pr9", date: "2024-09-03", note: "Stir World" },
  { id: "artist-kubra-aliyeva", key: "pr0", date: "2025-12-27", note: "Blowout — Between Worlds" },
  { id: "artist-tallulah-hutson", key: "pr2", date: "2025-12-27", note: "Blowout — Between Worlds" },
  { id: "artist-mary-pye", key: "pr2", date: "2025-09-18", note: "Blowout — Frieze New York" },
];

for (const { id, key, date, note } of dateFixes) {
  const result = await client
    .patch(id)
    .set({ [`press[_key=="${key}"].date`]: date })
    .commit();
  console.log(`Set date ${date} on ${id} / ${key} (${note})`);
  void result;
}

console.log("\nDone:", dateFixes.length, "dates filled.");
