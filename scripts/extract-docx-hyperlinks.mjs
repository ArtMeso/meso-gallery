// Extracts all hyperlinks (visible text + target URL) from a .docx file.
// Usage: node extract-docx-hyperlinks.mjs "path/to/file.docx"
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const docxPath = process.argv[2];
if (!docxPath) {
  console.error("Usage: node extract-docx-hyperlinks.mjs <docx path>");
  process.exit(1);
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "docx-"));
execFileSync("unzip", ["-q", "-o", docxPath, "-d", tmpDir]);

const relsPath = path.join(tmpDir, "word", "_rels", "document.xml.rels");
const docPath = path.join(tmpDir, "word", "document.xml");

const rels = fs.readFileSync(relsPath, "utf8");
const relMap = {};
for (const m of rels.matchAll(/<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"[^>]*\/>/g)) {
  relMap[m[1]] = m[2];
}
// Target attr can come before Id attr too; handle both orders.
for (const m of rels.matchAll(/<Relationship[^>]*Target="([^"]+)"[^>]*Id="([^"]+)"[^>]*\/>/g)) {
  relMap[m[2]] = m[1];
}

const doc = fs.readFileSync(docPath, "utf8");
const results = [];
for (const m of doc.matchAll(/<w:hyperlink[^>]*r:id="([^"]+)"[^>]*>(.*?)<\/w:hyperlink>/gs)) {
  const rId = m[1];
  const inner = m[2];
  const text = [...inner.matchAll(/<w:t[^>]*>(.*?)<\/w:t>/g)].map((t) => t[1]).join("");
  const url = relMap[rId];
  if (url && url.startsWith("http")) {
    results.push({ text: text.trim(), url });
  }
}

console.log(JSON.stringify(results, null, 2));
fs.rmSync(tmpDir, { recursive: true, force: true });
