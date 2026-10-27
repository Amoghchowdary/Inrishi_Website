import fs from "node:fs";
import path from "node:path";
const errors=[];
const read=p=>fs.readFileSync(p,"utf8");
const vite=read("vite.config.ts"), html=read("index.html"), router=read("src/router.tsx"), helper=read("src/lib/site-path.ts"), four=read("public/404.html"), tree=read("src/routeTree.gen.ts");
if(!vite.includes('base: "./"')) errors.push("Vite base must be relative so one artifact works at the GitHub repository path and custom-domain root.");
if(!html.includes('%BASE_URL%favicon.png')||!html.includes('%BASE_URL%inrishi-config.js')) errors.push("Public HTML assets must honor Vite BASE_URL.");
if(!router.includes('basepath: getSiteBasePath() || "/"')) errors.push("TanStack Router dynamic basepath is missing.");
if(!helper.includes('GITHUB_REPOSITORY = "Inrishi_Website"')) errors.push("GitHub project-site repository detector is incorrect.");
if(!four.includes('var repo="Inrishi_Website"')) errors.push("SPA 404 redirect is not repository-path aware.");if(!four.includes("INTELLIGENCE INSIDE."))errors.push("Branded route-recovery page is missing.");
for(const route of ["/", "/sample-work", "/contact", "/customer-login", "/customer-portal", "/admin", "/r/9f2a7c4d6e"]){if(!tree.includes(`'${route}'`))errors.push(`Canonical route missing from route tree: ${route}`);}
const sourceFiles=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(/\.(?:ts|tsx)$/.test(e.name))sourceFiles.push(f);}}walk("src");
for(const f of sourceFiles){const s=read(f);if(/href="\//.test(s))errors.push(`Hard-rooted internal href remains: ${f}`);if(/location\.assign\("\//.test(s))errors.push(`Hard-rooted location.assign remains: ${f}`);if(/const\s+\w*Href\s*=\s*["']\//.test(s))errors.push(`Hard-rooted route variable remains: ${f}`);}
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V57 MAIN GitHub Pages path verification passed for custom-domain root and /Inrishi_Website/ project path.");
