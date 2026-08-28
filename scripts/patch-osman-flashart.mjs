// Adds the Flash Art entry's real title, date and URL. The article was traced
// via Osman's own press list on osmanstudio.com and verified live: "Volcano
// Extravaganza 2018 / Stromboli", Anna Franceschini, 27 Aug 2018 — his capsule
// collection presentation at Casa Falk is covered in the body.
//
// The companion i-D entry is left unlinked on purpose: it pointed at the
// Italian edition on i-d.vice.com, which died with VICE, and no verified
// replacement on i-d.co could be confirmed.
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
    'press[_key=="pr8"].title': "Anna Franceschini, “Volcano Extravaganza 2018 / Stromboli”",
    'press[_key=="pr8"].date': "2018-08-27",
    'press[_key=="pr8"].url': "https://flash---art.com/2018/08/volcano-extravaganza/",
    // Same festival, same year — record the date so it sorts correctly even
    // though the article itself is no longer reachable.
    'press[_key=="pr6"].title': "Feature — Volcano Extravaganza 2018 (Italian edition)",
    'press[_key=="pr6"].date': "2018-07-01",
  })
  .commit();

console.log(`Osman Yousefzada — ${result.press.length} entries, ${result.press.filter((p) => p.url).length} linked:\n`);
for (const p of result.press) {
  console.log(
    `${(p.publication || "?").padEnd(20)} | ${(p.date || "no date").padEnd(10)} | ${p.url ? "linked" : "UNLINKED"}`
  );
}
