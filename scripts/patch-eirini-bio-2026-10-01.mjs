// Updates Eirini Meze's About page bio with new credentials from the
// 2026 Company Profile: CEO title at FAACII, the Linsey Foundation detail
// (David Linsey, fundraising balls), Frieze Connect programme, and the
// three Bulgari exhibitions — per Eirini's review 2026-10-01.
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

const bio =
  "Eirini Meze is an art advisor and gallerist, and the founder of MeSo Ventures, an international art advisory and contemporary art gallery working across Dubai, London, New York and Mumbai, with particular depth in South Asian art and Indian Modern Masters. She is a Global Ambassador for Frieze Connect, organising a programme of events for members across the Middle East and India — including a private collection visit in New York with collector Priya Karani and a panel on next-generation collecting in London — and has hosted three exhibitions with Bulgari in London for emerging artists. She founded FAACII (For Art and Culture in India Inc.), a New York 501(c)(3) public charity, where she now serves as Chairwoman & CEO, and previously served on the Board of Trustees of the Amelie and Daniel Linsey Foundation, organising fundraising balls with founder David Linsey at The Peninsula London, with auctions by Christie's.";

const members = await client.fetch(
  `*[_type == "teamMember" && name == "Eirini Meze"]{_id}`
);

if (members.length === 0) {
  console.error('No teamMember document found with name "Eirini Meze".');
  process.exit(1);
}

for (const { _id } of members) {
  const result = await client.patch(_id).set({ bio }).commit();
  console.log(`updated bio on ${result._id}`);
}

console.log(`\nDone: ${members.length} document(s) updated.`);
