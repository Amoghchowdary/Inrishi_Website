import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const errors=[];
const required=[
  "package.json","index.html","vite.config.ts","public/404.html","public/favicon.svg","public/inrishi-logo.png","public/inrishi-config.js",
  "src/main.tsx","src/styles.css","src/lib/apps-script-api.ts","src/lib/business-api.ts","src/lib/runtime-config.ts",
  "src/routes/index.tsx","src/routes/contact.tsx","src/routes/sample-work.tsx","src/routes/customer-login.tsx","src/routes/customer-portal.tsx",
  "src/assets/inrishi-public-logo.png","src/components/cosmic-environment.tsx","src/components/admin-workspace.tsx","src/routes/admin.tsx","src/routes/partner.tsx","src/routes/partner-login.tsx","src/routes/partner-register.tsx","src/routes/partner-portal.tsx","src/routes/r.9f2a7c4d6e.tsx",
  ".github/workflows/deploy-pages.yml",".github/workflows/quality.yml","scripts/check-config.mjs","scripts/verify-dependencies.mjs","scripts/verify-design-regression.mjs","scripts/verify-ui.mjs","scripts/verify-dist.mjs","scripts/prepare-pages.mjs","scripts/verify-runtime-exports.mjs"
];
for(const rel of required) if(!fs.existsSync(path.join(root,rel))) errors.push(`Missing required production file: ${rel}`);
if(fs.existsSync(path.join(root,".git"))) errors.push("V52 development source must not contain .git metadata.");
if(fs.existsSync(path.join(root,"apps-script"))) errors.push("Apps Script backend source must not be present in the frontend Git package.");
const pkg=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
if(pkg.version!=="52.0.0") errors.push("Unexpected V52 package version.");
if(pkg.dependencies?.["@tanstack/react-start"]||pkg.dependencies?.nitro||pkg.devDependencies?.["@tanstack/react-start"]) errors.push("Server runtime dependency remains in static frontend package.");
for(const forbidden of ["dev","preview","start","push:git","configure"]) if(pkg.scripts?.[forbidden]) errors.push(`Forbidden production script remains: ${forbidden}`);
const appsApi=fs.readFileSync(path.join(root,"src/lib/apps-script-api.ts"),"utf8");
const viteConfig=fs.readFileSync(path.join(root,"vite.config.ts"),"utf8");
if(!appsApi.includes('code:string|undefined')) errors.push("AppsScriptBackendError.code must explicitly allow undefined under exactOptionalPropertyTypes.");
if(/minify\s*:\s*["']esbuild["']/.test(viteConfig)) errors.push("Deprecated Vite 8 esbuild minifier is still configured.");
const config=fs.readFileSync(path.join(root,"public/inrishi-config.js"),"utf8");
const expectedBackend="https://script.google.com/macros/s/AKfycbzQ1YMIghWp_p3hy3NxsJraffY_AjLA77JlyfYF7YvkGlylLnV2MiDgJViLjByn9ntq/exec";
if(!config.includes('APP_VERSION: "52.0.0"')) errors.push("Runtime APP_VERSION is not V52.");
if(!config.includes(expectedBackend)) errors.push("Approved Apps Script endpoint is missing.");
const textExtensions=new Set([".ts",".tsx",".js",".jsx",".mjs",".html",".css",".json",".yml",".yaml"]);
const skipDirs=new Set(["node_modules","dist",".git"]);
const secretPatterns=[/INRISHI_DB_SPREADSHEET_ID/i,/INRISHI_FILES_FOLDER_ID/i,/PASSWORD_PEPPER/i,/DriveApp\./,/SpreadsheetApp\./,/PropertiesService\./,/function\s+setupInrishiBackend\s*\(/];
function walk(dir){ if(!fs.existsSync(dir)) return; for(const entry of fs.readdirSync(dir,{withFileTypes:true})){ if(skipDirs.has(entry.name)) continue; const full=path.join(dir,entry.name); if(entry.isDirectory()) walk(full); else { if(path.extname(entry.name).toLowerCase()===".gs") errors.push(`Apps Script source found in frontend: ${path.relative(root,full)}`); if(textExtensions.has(path.extname(entry.name).toLowerCase())){ const t=fs.readFileSync(full,"utf8"); if(/localhost/i.test(t)) errors.push(`Localhost reference remains in deployable source: ${path.relative(root,full)}`); if(/Testing credentials|Test OTP|Test login|for testing only|Reset all testing data/i.test(t)) errors.push(`Testing reference remains in deployable source: ${path.relative(root,full)}`); for(const pattern of secretPatterns) if(pattern.test(t)) errors.push(`Backend-only code or secret identifier found in ${path.relative(root,full)}`); } } } }
walk(path.join(root,"src")); walk(path.join(root,"public")); walk(path.join(root,".github"));
const runtimeConfigSource=fs.readFileSync(path.join(root,"src/lib/runtime-config.ts"),"utf8");if(!runtimeConfigSource.includes("export function getRuntimeConfig")) errors.push("runtime-config getRuntimeConfig export is missing.");if(!runtimeConfigSource.includes("export function isBackendConfigured")) errors.push("runtime-config isBackendConfigured export is missing.");if(errors.length){console.error([...new Set(errors)].map(e=>`ERROR: ${e}`).join("\n"));process.exit(1);} console.log("Inrishi V52 frontend production verification passed.");
