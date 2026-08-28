// Removes Tallulah Hutson's "The Guide Magazine, Volume 3" press credit.
//
// This is not a merely-offline print credit. The closest candidate publication
// (The Guide Artists) numbers its editions 1–107 and has never used "Volume"
// numbering, and neither Hutson nor the credited author Sophia Dearie appears
// anywhere in its archive or shop. No publication matching the citation could
// be located. Tiyana's Two Hands and Washington Life credits are NOT touched:
// those are confirmed genuine, just never digitised.
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

// Confirm we're removing the right entry before unsetting it.
const before = await client.fetch(`*[_id == "artist-tallulah-hutson"][0]{press}`);
const target = (before.press || []).find((p) => p._key === "pr0");
if (!target) {
  console.error("Entry pr0 not found — aborting.");
  process.exit(1);
}
if (!/Guide Magazine/i.test(target.publication || "")) {
  console.error(`pr0 is "${target.publication}", not the Guide Magazine entry — aborting.`);
  process.exit(1);
}
console.log(`Removing: "${target.title}" — ${target.publication}`);

const r = await client.patch("artist-tallulah-hutson").unset(['press[_key=="pr0"]']).commit();
console.log(`\nTallulah Hutson: ${r.press.length} entries, ${r.press.filter((p) => p.url).length} linked`);
for (const p of r.press) {
  console.log(`  ${(p.publication || "?").padEnd(40)} | ${p.url ? "linked" : "UNLINKED"}`);
}
