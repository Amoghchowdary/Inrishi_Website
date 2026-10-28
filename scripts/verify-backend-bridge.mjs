import fs from "node:fs";
const errors=[];
const api=fs.readFileSync("src/lib/apps-script-api.ts","utf8"),cfg=fs.readFileSync("public/inrishi-config.js","utf8");
if(!api.includes("pageUrl:location.href"))errors.push("Apps Script request must include pageUrl.");
if(!api.includes("origin:location.origin"))errors.push("V62 form POST must send the actual frontend origin.");
if(!api.includes('form.method="POST"')||!api.includes("form.submit()"))errors.push("V62 form-post backend transport is missing.");
if(api.includes("ensureRpcBridge"))errors.push("Broken persistent RPC bridge returned.");
if(!cfg.includes('SITE_ID: "main"'))errors.push("SITE_ID mismatch.");
if(!cfg.includes("https://script.google.com/macros/s/AKfycbzQ1YMIghWp_p3hy3NxsJraffY_AjLA77JlyfYF7YvkGlylLnV2MiDgJViLjByn9ntq/exec"))errors.push("Apps Script backend URL changed or missing.");
if(!api.includes('type Role="public"|"customer"|"admin"'))errors.push("Main API role boundary changed.");
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V62 MAIN backend transport contract passed.");
