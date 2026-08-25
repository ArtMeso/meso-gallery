// Points every internal link in the content at its final live URL.
//
// Three problems, all from the Squarespace migration and the www -> apex flip:
//
//  1. Absolute self-links (http://www.mesoventures.com/..., https://mesoventures.com/...)
//     These work, but they hard-code a host that has already changed once. As
//     relative paths they follow the site wherever it lives and never take a
//     protocol or www redirect hop.
//  2. Legacy paths that now 308 (/home, /jessie-makinson, /news-and-press/...).
//     A redirect costs a round trip and dilutes the link; pointing at the
//     destination is strictly better.
//  3. Links to targets that no longer deserve one. /gesture-of-memories now
//     redirects into the very article that links to it, and /rex-southwick is
//     a dropped artist whose name shouldn't point at a roster that omits him.
//     Both have their link mark removed, keeping the visible text intact.
//
// Note /mohini-kaur and /naira-mushtaq are absent throughout — audited across
// every article, artist and team document including press fields — so the 410s
// on those two orphan nothing.
//
// Run with --dry to preview.
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes("--dry");

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

// Legacy path -> live path. Applied after the origin is stripped, so both the
// absolute and relative spellings of each are covered by one entry.
const REPOINT = new Map([
  ["/home", "/"],
  ["/home-1", "/"],
  ["/jessie-makinson", "/artists/jessie-makinson"],
  ["/mary-pye", "/artists/mary-pye"],
  ["/parnika-mittal", "/artists/parnika-mittal"],
  ["/tiyana-mitchell", "/artists/tiyana-mitchell"],
  ["/kubra-aliyeva", "/artists/kubra-aliyeva"],
  ["/osman-yousefzada", "/artists/osman-yousefzada"],
  ["/tallulah-hutson", "/artists/tallulah-hutson"],
  ["/lydia-hamblet", "/artists/lydia-hamblet"],
  ["/mengmeng-zhang", "/artists/mengmeng-zhang"],
  ["/joya-mukerjee-logue", "/artists/joya-mukerjee-logue"],
  ["/chiedu-okonta", "/artists/chiedu-okonta"],
  ["/artists-exhibitions-works-biographies", "/artists"],
  ["/news-and-press", "/magazine"],
  [
    "/news-and-press/mythologies-of-colour-soho-house-mumbai-2026",
    "/magazine/mythologies-of-colour-soho-house-mumbai-2026",
  ],
  [
    "/news-and-press/meso-ventures-and-bulgari-present-what-light-remains-tiyana-mitchell",
    "/magazine/meso-ventures-and-bulgari-present-what-light-remains-tiyana-mitchell",
  ],
  ["/india-art-fair-delhi", "/magazine/india-art-fair-2026-new-delhi-art-week-delhi-2026"],
  ["/the-mythologies-of-colour-soho-house-mumbai", "/magazine/mythologies-of-colour-soho-house-mumbai-2026"],
]);

// Links to remove entirely, keeping the anchor text as plain prose.
const UNLINK = new Set(["/gesture-of-memories", "/rex-southwick"]);

const ORIGIN = /^https?:\/\/(www\.)?mesoventures\.com/i;

function normaliseHref(href) {
  if (typeof href !== "string") return href;
  if (!ORIGIN.test(href) && !href.startsWith("/")) return href; // external, leave alone

  let out = href.replace(ORIGIN, "");
  if (out === "") out = "/";

  // Split off any query/hash so the path matches the repoint table.
  const m = out.match(/^([^?#]*)(.*)$/);
  const [, pathname, suffix] = m;
  const trimmed = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

  if (REPOINT.has(trimmed)) return REPOINT.get(trimmed) + suffix;
  return trimmed + suffix;
}

/** Remove a link markDef and drop its key from every span that carried it. */
function unlinkBlock(block, markKey) {
  block.markDefs = (block.markDefs || []).filter((d) => d._key !== markKey);
  for (const child of block.children || []) {
    if (child.marks?.includes(markKey)) {
      child.marks = child.marks.filter((m) => m !== markKey);
    }
  }
}

const docs = await client.fetch(
  `*[_type in ["article","artist"] && !(_id in path("drafts.**"))]{_id, _type, "slug": slug.current, body, bio}`
);

let changedDocs = 0;
let rewrites = 0;
let unlinks = 0;

for (const doc of docs) {
  const fields = doc._type === "article" ? ["body"] : ["bio"];
  const patchSet = {};

  for (const field of fields) {
    const original = doc[field];
    if (!Array.isArray(original)) continue;

    const blocks = JSON.parse(JSON.stringify(original));
    let touched = false;

    for (const block of blocks) {
      if (block._type !== "block" || !Array.isArray(block.markDefs)) continue;

      // Snapshot: unlinking mutates markDefs while we iterate.
      for (const def of [...block.markDefs]) {
        if (def._type !== "link" || typeof def.href !== "string") continue;

        const relative = def.href.replace(ORIGIN, "") || "/";
        const bare = relative.split(/[?#]/)[0].replace(/(.)\/$/, "$1");

        if (UNLINK.has(bare)) {
          unlinkBlock(block, def._key);
          console.log(`  ${doc.slug}: unlinked ${def.href}`);
          unlinks++;
          touched = true;
          continue;
        }

        const next = normaliseHref(def.href);
        if (next !== def.href) {
          console.log(`  ${doc.slug}: ${def.href}  ->  ${next}`);
          def.href = next;
          rewrites++;
          touched = true;
        }
      }
    }

    if (touched) patchSet[field] = blocks;
  }

  if (Object.keys(patchSet).length === 0) continue;
  changedDocs++;
  if (!DRY) await client.patch(doc._id).set(patchSet).commit();
}

console.log(
  `\n${DRY ? "[dry run] " : ""}${rewrites} link(s) repointed, ${unlinks} unlinked, across ${changedDocs} document(s).`
);
