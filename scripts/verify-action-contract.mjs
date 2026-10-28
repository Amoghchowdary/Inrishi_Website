import fs from "node:fs";import path from "node:path";
const contract=JSON.parse(fs.readFileSync("backend-contract.json","utf8"));
const allowed=new Set(contract.actions),used=new Set(),errors=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(?:ts|tsx)$/.test(e.name)){const t=fs.readFileSync(p,"utf8");for(const m of t.matchAll(/appsScriptCall(?:<[^>]+>)?\(\s*["']([^"']+)["']/g))used.add(m[1]);}}}
walk("src");
for(const a of used)if(!allowed.has(a))errors.push(`Frontend action is absent from backend contract: ${a}`);
if(contract.version!=="61.0.0")errors.push("Backend contract must be V61.");
if(contract.transport!=="apps-script-form-post")errors.push("Backend contract must use the V61 form-post transport.");
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log(`V61 frontend/backend action contract passed: ${used.size} frontend action(s) covered by ${allowed.size} backend action(s).`);
