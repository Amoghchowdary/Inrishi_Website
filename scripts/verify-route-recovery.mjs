import fs from "node:fs";
const errors=[];const read=p=>fs.readFileSync(p,"utf8");const tree=read("src/routeTree.gen.ts"),four=read("public/404.html"),html=read("index.html");
const allowed=["/","/contact","/sample-work","/services","/partner-program","/about-inrishi","/industries","/customer-login","/customer-portal","/admin","/services/ai-business-transformation","/services/crm","/services/employee-management","/services/website-design"];
for(const r of allowed)if(!tree.includes(`'${r}'`))errors.push(`Allowed route missing: ${r}`);
for(const r of ["/r/9f2a7c4d6e","/services/books-customization","/services/custom-software","/services/saas-products","/partner","/login","/register","/portal"])if(tree.includes(`'${r}'`))errors.push(`Retired/non-main route still exists: ${r}`);
if(/location\.replace|\/\?\/|~and~|Finding your Inrishi page|Route recovery/i.test(four+html))errors.push("Legacy SPA route-recovery mechanism still exists.");
if(!four.includes("404 / INRISHI")||!four.includes("Page not found.")||!four.includes("noindex,nofollow,noarchive"))errors.push("Terminal custom Main 404 is incomplete.");
for(const f of ["src/routes/r.9f2a7c4d6e.tsx","src/routes/service-books-customization.tsx","src/routes/service-custom-software.tsx","src/routes/service-saas-products.tsx"])if(fs.existsSync(f))errors.push(`Retired source still ships: ${f}`);
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}console.log("V81 Main strict-route/terminal-404 gate passed.");
