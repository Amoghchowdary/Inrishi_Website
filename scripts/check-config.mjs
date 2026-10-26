import fs from 'node:fs';

const text = fs.readFileSync('public/inrishi-config.js', 'utf8');
const url = text.match(/APPS_SCRIPT_URL:\s*"([^"]+)"/)?.[1] ?? '';
const main = text.match(/MAIN_ORIGIN:\s*"([^"]+)"/)?.[1] ?? '';
const partner = text.match(/PARTNER_ORIGIN:\s*"([^"]+)"/)?.[1] ?? '';
const errors = [];
if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/.test(url)) errors.push('Apps Script /exec URL is invalid or missing.');
if (main !== 'https://www.inrishi.in') errors.push('MAIN_ORIGIN must be https://www.inrishi.in');
if (partner !== 'https://partner.inrishi.in') errors.push('PARTNER_ORIGIN must be https://partner.inrishi.in');
for (const token of ['customerLogin','customerPortal','adminEntry','login','register','portal']) if (!text.includes(token)) errors.push(`Missing portal route: ${token}`);
if (errors.length) { console.error(errors.map((e)=>`ERROR: ${e}`).join('\n')); process.exit(1); }
console.log('Combined Inrishi runtime configuration is valid.');
console.log(`Backend: ${url}`);
console.log(`Main: ${main}`);
console.log(`Partner: ${partner}`);
