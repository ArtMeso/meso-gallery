// Adds internal links to the two guide articles that had none.
//
// how-to-start-an-art-collection is the largest single opportunity in Search
// Console — 985 impressions on its head term at position 13.7 with a 0.43% CTR
// — and its body contained zero link marks. The content itself is strong, so
// the constraint is not depth but connection: the page mentions Art Dubai,
// Frieze, the India Art Fair, art advisors and collection building in plain
// text while separate pages on this site cover each of them. Those mentions
// become links here, which both helps readers and tells Google the guide sits
// at the centre of a cluster rather than alone.
//
// art-as-an-investment-2026-guide-for-collectors (767 impressions, position
// 9.6) also had zero links, and is the natural reciprocal target.
//
// Run with --dry to report what would change without writing.
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

let keySeq = 0;
const newKey = (prefix) => `${prefix}-${Date.now().toString(36)}-${keySeq++}`;

// Sanity stores curly apostrophes in some blocks and straight ones in others;
// match on a normalised copy so a phrase written either way still finds its
// span, then slice the ORIGINAL text at the same offsets (normalising is
// character-for-character, so offsets are preserved).
const normalise = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

/**
 * Wrap the first occurrence of `phrase` in a link to `href`.
 * Returns true if the phrase was found and linked.
 */
function linkify(block, phrase, href) {
  if (block._type !== "block" || !Array.isArray(block.children)) return false;

  const target = normalise(phrase);

  for (let i = 0; i < block.children.length; i++) {
    const child = block.children[i];
    if (child._type !== "span" || typeof child.text !== "string") continue;
    // Don't nest a link inside an existing one.
    if (child.marks?.some((m) => (block.markDefs || []).some((d) => d._key === m))) continue;

    const at = normalise(child.text).indexOf(target);
    if (at === -1) continue;

    const before = child.text.slice(0, at);
    const middle = child.text.slice(at, at + phrase.length);
    const after = child.text.slice(at + phrase.length);

    const markKey = newKey("link");
    block.markDefs = [...(block.markDefs || []), { _key: markKey, _type: "link", href }];

    const replacement = [];
    if (before) replacement.push({ ...child, _key: newKey("span"), text: before });
    replacement.push({
      ...child,
      _key: newKey("span"),
      text: middle,
      marks: [...(child.marks || []), markKey],
    });
    if (after) replacement.push({ ...child, _key: newKey("span"), text: after });

    block.children.splice(i, 1, ...replacement);
    return true;
  }
  return false;
}

const plans = [
  {
    id: "article-how-to-start-an-art-collection",
    links: [
      // Order matters: "Art Dubai" is linked before "Frieze London" so each
      // resolves against its own span in the same sentence.
      ["Art Dubai", "/magazine/art-dubai-special-edition-2026-guide"],
      ["Frieze London", "/magazine/frieze-london-2026-collectors-guide"],
      ["the India Art Fair in New Delhi", "/magazine/india-art-fair-2026-new-delhi-art-week-delhi-2026"],
      ["Working with an art advisor", "/art-advisory"],
      ["whether the art you buy will appreciate", "/magazine/art-as-an-investment-2026-guide-for-collectors"],
      ["current artists", "/artists"],
      ["more structured collection-building strategy", "/collection-building"],
      ["Reach out to the team", "/contact"],
    ],
  },
  {
    id: "article-art-as-an-investment-2026-guide-for-collectors",
    links: [
      ["early-career artists and works on paper", "/magazine/how-to-start-an-art-collection"],
      ["Building a collection is a deliberate, strategic process", "/collection-building"],
      ["art advisor", "/art-advisory"],
    ],
  },
];

let failures = 0;

for (const plan of plans) {
  const doc = await client.getDocument(plan.id);
  if (!doc) {
    console.error(`MISSING DOCUMENT: ${plan.id}`);
    failures++;
    continue;
  }

  const body = JSON.parse(JSON.stringify(doc.body || []));
  console.log(`\n${plan.id}`);

  const applied = [];
  for (const [phrase, href] of plan.links) {
    const hit = body.some((block) => linkify(block, phrase, href));
    if (hit) {
      applied.push(phrase);
      console.log(`  linked   "${phrase}" -> ${href}`);
    } else {
      console.log(`  NOT FOUND "${phrase}" (skipped)`);
      failures++;
    }
  }

  if (DRY) {
    console.log(`  [dry run] ${applied.length}/${plan.links.length} would be written`);
    continue;
  }
  if (applied.length === 0) {
    console.log("  nothing to write");
    continue;
  }

  await client.patch(plan.id).set({ body }).commit();
  console.log(`  written: ${applied.length} link(s)`);
}

console.log(
  failures > 0
    ? `\nDone with ${failures} phrase(s) not found — check the wording above.`
    : "\nDone, all phrases matched."
);
