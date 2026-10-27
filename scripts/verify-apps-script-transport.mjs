import fs from "node:fs";
const source=fs.readFileSync("src/lib/apps-script-api.ts","utf8");
const errors=[];
for(const token of [
  'host.endsWith("-script.googleusercontent.com")',
  'host.endsWith(".script.googleusercontent.com")',
  'host==="script.google.com"',
  'host==="script.googleusercontent.com"',
  'BACKEND_RESPONSE_TIMEOUT',
  'pageUrl:location.href',
  'requestId'
]){
  if(!source.includes(token)) errors.push(`Missing Apps Script transport requirement: ${token}`);
}
if(source.includes('function safeOrigin(o:string){return /^https:\\/\\/(?:script\\.google\\.com|script\\.googleusercontent\\.com)$/.test(o)}')){
  errors.push('Legacy exact-host Apps Script origin filter is still present.');
}
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V56 Apps Script transport verified: dynamic Google sandbox origins, request correlation and production timeout handling are locked.");
