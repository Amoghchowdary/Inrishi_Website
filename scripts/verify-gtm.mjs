import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const htmlPath = path.join(root, "index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const expected = "GTM-WSCMN3T2";
const forbidden = "GTM-NH8FPTZF";
const occurrences = html.split(expected).length - 1;

if (occurrences !== 1) {
  console.error(`ERROR: Expected ${expected} exactly once in index.html; found ${occurrences}.`);
  process.exit(1);
}
if (html.includes(forbidden)) {
  console.error(`ERROR: Wrong GTM container ${forbidden} detected in Main site.`);
  process.exit(1);
}
if (!html.includes("https://www.googletagmanager.com/gtm.js?id=" + expected)) {
  console.error("ERROR: GTM loader URL is missing or incorrect.");
  process.exit(1);
}
if (!html.includes("window.dataLayer = window.dataLayer || []")) {
  console.error("ERROR: dataLayer initialization is missing.");
  process.exit(1);
}
if (!html.includes("gtag('js', new Date())")) {
  console.error("ERROR: GTM initialization event is missing.");
  process.exit(1);
}
console.log("PASS: Main GTM container GTM-WSCMN3T2 is connected exactly once.");
