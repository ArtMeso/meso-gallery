// Appends FAQ entries to the collecting guide for questions the body genuinely
// doesn't answer.
//
// The guide already covers budgets, where to buy, diligence and value, and
// those four existing FAQ entries stay untouched. What it never addresses is
// auctions, the primary/secondary market distinction, or pace — all of which
// are standard first-collector questions, and all of which are question-shaped
// queries that FAQPage markup can surface directly.
//
// Search Console shows the page owns its head term at position 13.7 but falls
// away badly on close variants ("how to start collecting art" 77, "start an
// art collection" 57, "beginner art collector" 55), which is the signature of
// thin coverage of the surrounding question space rather than a weak page.
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

const ARTICLE_ID = "article-how-to-start-an-art-collection";

const additions = [
  {
    question: "Should I buy art at auction as a beginner?",
    answer:
      "Usually not for your first purchases. Auctions look transparent because the results are public, but the hammer price is not the price you pay — buyer's premium, taxes and shipping commonly add 25–30% on top, and lots are sold as seen with limited recourse if the condition report missed something. Galleries are the better first route: the price is fixed and inclusive, and you can ask the dealer questions the catalogue won't answer. Auctions become genuinely useful once you know an artist's market well enough to recognise when a lot is underpriced.",
  },
  {
    question: "What is the difference between the primary and secondary art market?",
    answer:
      "The primary market is the first sale of a work, from the artist through their gallery, and the price is set rather than bid. The secondary market is every resale after that — auction houses, dealers and private sales — where price is set by what someone will pay on the day. Most first collections are built on the primary market, because emerging work is more affordable there and buying it supports the artist directly. The secondary market matters later, both as a place to acquire established work and as the evidence of whether an artist's prices have actually held.",
  },
  {
    question: "How many works should I buy in the first year?",
    answer:
      "Fewer than you might expect. Two or three considered acquisitions in a first year is a healthy pace, and buying nothing for six months while you look is not a wasted six months. Collections that go wrong usually do so through speed rather than budget — a rapid run of purchases made before your taste has settled tends to produce a group of works that don't speak to each other. The discipline of waiting is most of what separates a collection from an accumulation.",
  },
  {
    question: "Can I start an art collection on a small budget?",
    answer:
      "Yes, and it is the most common way collections begin. A budget of £500–£1,000 per work reaches recent graduates from serious programmes and works on paper by artists whose canvases are already out of reach, both of which are real collecting categories rather than compromises. Consistency matters far more than the size of any single purchase: one considered acquisition a year for ten years produces a better collection than ten bought at once.",
  },
];

const doc = await client.getDocument(ARTICLE_ID);
if (!doc) {
  console.error(`Document not found: ${ARTICLE_ID}`);
  process.exit(1);
}

const existing = doc.faq || [];
const existingQuestions = new Set(existing.map((f) => f.question));

// Re-running must not duplicate entries.
const toAdd = additions
  .filter((f) => !existingQuestions.has(f.question))
  .map((f, i) => ({ ...f, _type: "faqEntry", _key: `faq-gap-${Date.now().toString(36)}-${i}` }));

if (toAdd.length === 0) {
  console.log("All FAQ entries already present — nothing to do.");
  process.exit(0);
}

const result = await client
  .patch(ARTICLE_ID)
  .setIfMissing({ faq: [] })
  .append("faq", toAdd)
  .commit();

console.log(`${result._id}`);
console.log(`  FAQ entries: ${existing.length} -> ${result.faq.length}`);
for (const f of toAdd) console.log(`  + ${f.question}`);
