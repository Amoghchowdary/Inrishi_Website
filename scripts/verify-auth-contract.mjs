import fs from "node:fs";

const errors=[];
const admin=fs.readFileSync("src/services/admin-auth.ts","utf8");
const workspace=fs.readFileSync("src/components/admin-workspace.tsx","utf8");
const css=fs.readFileSync("src/styles.css","utf8");
const runtime=fs.readFileSync("src/lib/runtime-config.ts","utf8");
const publicConfig=fs.readFileSync("public/inrishi-config.js","utf8");

for(const token of ['"auth.admin.login"','id: identifier','identifier,','email: identifier','password: data.password']){
  if(!admin.includes(token)) errors.push(`Admin login compatibility field missing: ${token}`);
}
if(!admin.includes('Boolean(raw.token)')) errors.push("Admin login must normalize backend success using a returned token.");
if(!workspace.includes('disabled={loading}')||!workspace.includes('Signing in…')) errors.push("Admin login loading state is missing.");
if(!workspace.includes('Administrator ID or email')) errors.push("Admin identifier field must accept ID or email.");
if(!workspace.includes('inrishi-public-logo.png')) errors.push("Admin must use the approved INRISHI public logo asset.");
if(!workspace.includes('admin-brand-logo')) errors.push("Admin logo must use the scoped V56 logo class.");
if(!css.includes('.admin-brand-logo{')) errors.push("Admin logo CSS is missing.");
if(css.includes('.admin-brand-logo{background:#fff')) errors.push("Admin logo must not force a white background.");
const backend="https://script.google.com/macros/s/AKfycbzQ1YMIghWp_p3hy3NxsJraffY_AjLA77JlyfYF7YvkGlylLnV2MiDgJViLjByn9ntq/exec";
if(!runtime.includes(backend)||!publicConfig.includes(backend)) errors.push("Approved Apps Script backend must remain embedded in both runtime layers.");
const apiSource=fs.readFileSync("src/lib/apps-script-api.ts","utf8");if(!apiSource.includes("site:config.SITE_ID")) errors.push("Apps Script request must carry production site identity.");if(!apiSource.includes("origin:location.origin")) errors.push("Apps Script request must carry browser origin.");if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V56 main auth contract passed: admin identifier compatibility, token session, loading state, approved logo and backend lock verified.");
