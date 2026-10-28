import fs from "node:fs";
import path from "node:path";
const errors=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(/\.tsx?$/.test(entry.name)){const source=fs.readFileSync(full,"utf8");if(!source.includes("currentTarget.elements"))continue;for(const m of source.matchAll(/currentTarget\.elements/g)){const before=source.slice(Math.max(0,m.index-500),m.index);if(!/FormEvent<HTMLFormElement>/.test(before))errors.push(`${path.relative(process.cwd(),full)} uses currentTarget.elements without FormEvent<HTMLFormElement>.`);}}}}
walk("src");
const admin=fs.readFileSync("src/components/admin-workspace.tsx","utf8");
if(!admin.includes("forcePassword(e:FormEvent<HTMLFormElement>)"))errors.push("Admin first-login password form is not strongly typed as HTMLFormElement.");
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V63 form-event type gate passed: every currentTarget.elements access is bound to HTMLFormElement.");
