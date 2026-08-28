// One-off patch: adds a single editorial internal link to the collecting
// guide from the Frieze London and India Art Fair articles, per the GSC
// internal-linking recommendation for /magazine/how-to-start-an-art-collection.
// Safe to re-run (uses `insert.after` targeted at a specific existing _key).
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

const guideLinkBlock = ({ blockKey, spanKeys, before, linkText, after }) => ({
  _key: blockKey,
  _type: "block",
  style: "normal",
  markDefs: [{ _key: `${blockKey}-link`, _type: "link", href: "/magazine/how-to-start-an-art-collection" }],
  children: [
    { _key: spanKeys[0], _type: "span", marks: [], text: before },
    { _key: spanKeys[1], _type: "span", marks: [`${blockKey}-link`], text: linkText },
    { _key: spanKeys[2], _type: "span", marks: [], text: after },
  ],
});

const patches = [
  {
    id: "article-frieze-london-2026-collectors-guide",
    afterKey: "blk18",
    block: guideLinkBlock({
      blockKey: "blk-guide-link-frieze",
      spanKeys: ["sp-glf-1", "sp-glf-2", "sp-glf-3"],
      before: "If this is your first time buying at a fair rather than just visiting one, it's worth reading our ",
      linkText: "guide to starting an art collection",
      after: " before you go — it covers budgeting, what to look for in a first piece, and how to tell a considered purchase from an impulse buy.",
    }),
  },
  {
    id: "article-india-art-fair-2026-new-delhi-art-week-delhi-2026",
    afterKey: "blk704",
    block: guideLinkBlock({
      blockKey: "blk-guide-link-iaf",
      spanKeys: ["sp-gli-1", "sp-gli-2", "sp-gli-3"],
      before: "If India Art Fair will be your first time buying rather than browsing, our ",
      linkText: "guide to starting an art collection",
      after: " walks through budget, provenance and what to check before a first purchase.",
    }),
  },
];

for (const { id, afterKey, block } of patches) {
  const result = await client
    .patch(id)
    .insert("after", `body[_key=="${afterKey}"]`, [block])
    .commit();
  console.log("Patched:", result._id, "— body length now:", result.body.length);
}
