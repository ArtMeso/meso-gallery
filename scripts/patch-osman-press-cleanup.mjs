// Follow-up to patch-osman-press.mjs:
//
// 1. Replaces the Art Newspaper entry's recorded headline, which matches no
//    live page, with the real 2022 interview (verified: Gareth Harris,
//    7 Mar 2022) and its URL.
// 2. Removes the "Feature — Dazed" row, now redundant: the Dazed article it
//    referred to is recorded in full on the entry previously mislabelled
//    "Vogue UK".
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
    'press[_key=="pr1"].title':
      "Gareth Harris, “Q&A | Osman Yousefzada on wrapping a department store and having early works destroyed by his family”",
    'press[_key=="pr1"].date': "2022-03-07",
    'press[_key=="pr1"].url':
      "https://www.theartnewspaper.com/2022/03/07/qanda-or-osman-yousefzada-on-wrapping-a-department-store-and-having-early-works-destroyed-by-his-family",
  })
  .unset(['press[_key=="pr7"]'])
  .commit();

console.log(`Osman Yousefzada — ${result.press.length} press entries:\n`);
for (const p of result.press) {
  console.log(
    `${(p.publication || "?").padEnd(22)} | ${(p.date || "no date").padEnd(10)} | ${p.url ? "linked" : "UNLINKED"}`
  );
}
