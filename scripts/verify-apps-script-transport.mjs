import fs from "node:fs";
const source=fs.readFileSync("src/lib/apps-script-api.ts","utf8");
const errors=[];
for(const token of [
  'form.method="POST"',
  'form.submit()',
  'form.target=iframeName',
  'pageUrl:location.href',
  'origin:location.origin',
  'host.endsWith("-script.googleusercontent.com")',
  'BACKEND_RESPONSE_TIMEOUT'
]){
  if(!source.includes(token))errors.push(`Missing V62 form-post transport requirement: ${token}`);
}
for(const forbidden of ["ensureRpcBridge","INRISHI_APPS_SCRIPT_BRIDGE","google.script.run"]){
  if(source.includes(forbidden))errors.push(`Broken persistent RPC bridge must not remain in V62 frontend: ${forbidden}`);
}
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V62 Apps Script transport verified: per-request POST/HtmlService response channel with dynamic Google sandbox origin trust.");
