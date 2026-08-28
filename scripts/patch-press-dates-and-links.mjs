// One-off patch: press entries that were missing `date` (so they sorted to the
// bottom of "Press & Publications" instead of chronologically) or `url` (so they
// rendered as plain, unlinked text).
//
// Dates verified against each article's own byline, the artist's press page, or
// the gallery's press listing.
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

const patches = [
  {
    id: "artist-joya-mukerjee-logue",
    set: {
      // Architectural Digest India, 30 Aug 2024
      'press[_key=="pr0"].date': "2024-08-30",
      // The Print, 31 Aug 2024
      'press[_key=="pr2"].date': "2024-08-31",
      // The Hindu, 12 Sep 2024
      'press[_key=="pr5"].date': "2024-09-12",
      // The Tribune, 8 Sep 2024
      'press[_key=="pr7"].date': "2024-09-08",
      // Platform Mag, 4 Sep 2024
      'press[_key=="pr8"].date': "2024-09-04",
      // Stir World, 3 Sep 2024
      'press[_key=="pr9"].date': "2024-09-03",
      // Vogue India, Mar/Apr 2023 — was missing its url
      'press[_key=="pr10"].date': "2023-03-01",
      'press[_key=="pr10"].url':
        "https://www.vogue.in/content/joya-mukerjee-logues-workspace-is-a-painting-within-a-painting-marvel",
    },
  },
  {
    id: "artist-mary-pye",
    set: {
      // Blowout Magazine, Frieze New York piece, 18 Sep 2025
      'press[_key=="pr2"].date': "2025-09-18",
    },
  },
  {
    id: "artist-kubra-aliyeva",
    set: {
      // Blowout Magazine, "Between Worlds", 27 Dec 2025
      'press[_key=="pr0"].date': "2025-12-27",
    },
  },
  {
    id: "artist-tallulah-hutson",
    set: {
      // Blowout Magazine, "Between Worlds", 27 Dec 2025
      'press[_key=="pr2"].date': "2025-12-27",
    },
  },
];

for (const { id, set } of patches) {
  const result = await client.patch(id).set(set).commit();
  console.log(`Patched ${result._id} — ${Object.keys(set).length} field(s) updated`);
}
