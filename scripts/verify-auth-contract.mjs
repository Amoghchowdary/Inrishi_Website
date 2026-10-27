import fs from "node:fs";
const errors=[];
const admin=fs.readFileSync("src/services/admin-auth.ts","utf8");
const workspace=fs.readFileSync("src/components/admin-workspace.tsx","utf8");
const control=fs.readFileSync("src/services/admin-control.ts","utf8");
const runtime=fs.readFileSync("src/lib/runtime-config.ts","utf8");
const publicConfig=fs.readFileSync("public/inrishi-config.js","utf8");
for(const token of ['"auth.admin.login"','id: identifier','identifier,','email: identifier','password: data.password']) if(!admin.includes(token)) errors.push(`Admin login compatibility field missing: ${token}`);
if(!admin.includes('Boolean(raw.token)')) errors.push("Admin login must require a returned backend token.");
if(!workspace.includes('disabled={loginLoading}')||!workspace.includes('Signing in…')) errors.push("Admin sign-in loading state is missing.");
if(!workspace.includes('Administrator ID or email')) errors.push("Admin identifier field must accept ID or email.");
for(const action of ['"admin.control.snapshot"','"admin.partner.status"','"admin.customer.status"','"admin.project.progress"','"admin.controls.save"']) if(!control.includes(action)) errors.push(`Admin production action missing: ${action}`);
if(!workspace.includes('Production backend')||!workspace.includes('Pending partners')||!workspace.includes('Website controls')) errors.push("Admin production control center modules are incomplete.");
const backend="https://script.google.com/macros/s/AKfycbzQ1YMIghWp_p3hy3NxsJraffY_AjLA77JlyfYF7YvkGlylLnV2MiDgJViLjByn9ntq/exec";
if(!runtime.includes(backend)||!publicConfig.includes(backend)) errors.push("Approved Apps Script backend must remain embedded in both runtime layers.");
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V59 main auth/control contract passed: Admin login, production snapshot and write actions are locked.");
