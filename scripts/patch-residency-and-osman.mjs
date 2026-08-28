// - Adds the 2026 FAACII residency to Mary Pye and Parnika Mittal. `awards` is
//   a plain string array in the schema, so the faacii.org URL can't be attached
//   here; format follows the existing convention ("YEAR — description").
// - Removes Osman's i-D entry: it pointed at the Italian edition on
//   i-d.vice.com, which died with VICE, and no live replacement was verifiable.
// - Adds the Art Plugged piece on The Mango Boat / High Line Plinth (verified
//   live, 3 Aug 2026).
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

const RESIDENCY =
  "2026 — FAACII Artist Residency India, in collaboration with Abode Bombay & Abode Jaipur";

for (const id of ["artist-mary-pye", "artist-parnika-mittal"]) {
  const current = await client.fetch(`*[_id == $id][0]{name, awards}`, { id });
  if ((current.awards || []).some((a) => a.includes("FAACII"))) {
    console.log(`${current.name}: residency already present, skipping`);
    continue;
  }
  const result = await client
    .patch(id)
    .setIfMissing({ awards: [] })
    .append("awards", [RESIDENCY])
    .commit();
  console.log(`${current.name}: residency added (${result.awards.length} awards/residencies)`);
}

const osman = await client
  .patch("artist-osman-yousefzada")
  .unset(['press[_key=="pr6"]'])
  .append("press", [
    {
      _key: "pr-artplugged-mangoboat",
      _type: "pressEntry",
      title: "“Osman Yousefzada’s The Mango Boat Longlisted for the High Line Plinth”",
      publication: "Art Plugged",
      date: "2026-08-03",
      url: "https://artplugged.co.uk/osman-yousefzadas-the-mango-boat-longlisted-the-high-line-plinth-bolanle-contemporary/",
    },
  ])
  .commit();

console.log(
  `\nOsman Yousefzada: ${osman.press.length} entries, ${osman.press.filter((p) => p.url).length} linked (i-D removed, Art Plugged added)`
);
