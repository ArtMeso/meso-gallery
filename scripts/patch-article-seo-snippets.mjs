// Rewrites search snippets for the two highest-impression guide articles.
//
// The layout appends " — MeSo Ventures" (16 chars) to every title, so a
// metaTitle must stay around 44 chars to survive Google's ~60-char display
// limit. Both articles were over it:
//
//   how-to-start-an-art-collection  65 + 16 = 81 chars (brand truncated away)
//   art-as-an-investment            no meta at all, fell back to the 57-char
//                                   article title -> 73 chars
//
// art-as-an-investment is the bigger prize: it sits at position 9.6 — page one
// — on 765 impressions with a 1.31% CTR, and had no optimised snippet at all.
// Its Search Console queries are mostly natural-language questions ("how to
// invest in art", "is art a good investment"), so the new title is phrased as
// the question rather than as a topic label.
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

const BRAND_SUFFIX = " — MeSo Ventures".length;

const updates = [
  {
    id: "article-art-as-an-investment-2026-guide-for-collectors",
    metaTitle: "Is Art a Good Investment? 2026 Collector Guide",
    metaDescription:
      "What art really returns, how the market actually works, and how to judge a piece before you buy — an honest guide for collectors weighing art as an investment.",
  },
  {
    id: "article-how-to-start-an-art-collection",
    metaTitle: "How to Start an Art Collection on Any Budget",
    // Existing description already performs the job; left as-is.
  },
];

for (const { id, metaTitle, metaDescription } of updates) {
  const total = metaTitle.length + BRAND_SUFFIX;
  if (total > 62) {
    console.error(`ABORT: "${metaTitle}" renders as ${total} chars, over the display limit.`);
    process.exit(1);
  }

  const set = { "seo.metaTitle": metaTitle };
  if (metaDescription) set["seo.metaDescription"] = metaDescription;

  const r = await client.patch(id).setIfMissing({ seo: {} }).set(set).commit();
  console.log(`${r._id}`);
  console.log(`  title: "${r.seo.metaTitle}" -> renders ${total} chars`);
  console.log(`  desc:  ${r.seo.metaDescription.length} chars\n`);
}
