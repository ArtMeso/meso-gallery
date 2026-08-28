// One-off patch: adds FAQ (with FAQPage schema via the article template) and
// SEO title/description to the "how-to-start-an-art-collection" guide, per
// the GSC quick-win analysis (1,019 impressions/quarter stuck at position
// ~13 for the "how to start an art collection" query). Safe to re-run.
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

const faq = [
  {
    _key: "faq-budget",
    _type: "faqEntry",
    question: "How much money do I need to start an art collection?",
    answer:
      "You don't need a large budget — $500–$1,000 is a genuinely useful starting range, and it's often the most interesting price bracket, covering recent art-school graduates and works on paper. At $2,000–$5,000 your options expand to small originals and limited editions from artists with an exhibition history. Working with an art advisor starts to make financial sense once you're spending $10,000 and above.",
  },
  {
    _key: "faq-investment",
    _type: "faqEntry",
    question: "Is buying art a good investment for beginners?",
    answer:
      "Treat it as a possible upside, not the goal. Some emerging-level work does appreciate significantly, some stays flat, and a small number lose value if an artist's market doesn't develop — the art market is illiquid and driven by cultural momentum, not the same forces as equities. Buy what you would want to live with for ten years regardless of price movement, and check public auction records on Artnet or Artprice before any significant purchase.",
  },
  {
    _key: "faq-where",
    _type: "faqEntry",
    question: "Where do I buy art if I've never bought any before?",
    answer:
      "Commercial galleries are the primary market and the easiest place to start — they're free to enter, provide certificates of authenticity, and are often flexible on payment timing for emerging artists. Art fairs (Art Dubai, Frieze, the India Art Fair) let you compare many galleries' prices in one afternoon. Online platforms are better suited to prints and editions than to significant original work, since you can't judge scale or surface in person.",
  },
  {
    _key: "faq-value",
    _type: "faqEntry",
    question: "How do I know if a piece of art is a good investment?",
    answer:
      "Look at the artist's exhibition history, gallery representation, and any press, residencies or institutional recognition — none guarantees future value, but each is a signal that others have looked closely and found the work worth supporting. Ask for provenance and a proper invoice (artist, title, date, medium, dimensions), and check the piece's condition carefully. Beyond that, an art advisor can give you a second opinion before a significant purchase.",
  },
];

const seo = {
  metaTitle: "How to Start an Art Collection on Any Budget — A Beginner's Guide",
  metaDescription:
    "A practical, no-jargon guide to buying your first artwork — from budgeting $500–$5,000 to spotting provenance, condition, and real investment potential.",
};

const result = await client
  .patch("article-how-to-start-an-art-collection")
  .set({ faq, seo })
  .commit();

console.log("Patched:", result._id, "— faq entries:", result.faq?.length, "— seo:", result.seo);
