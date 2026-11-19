import fs from "node:fs";
const read=f=>fs.readFileSync(f,"utf8");
const fail=[];const ok=(v,m)=>{if(!v)fail.push(m)};
const prep=read("scripts/prepare-pages.mjs"),robots=read("public/robots.txt"),llms=read("public/llms.txt"),map=read("public/sitemap.xml"),about=read("src/routes/about-inrishi.tsx"),svc=["service-ai-business-transformation.tsx","service-crm.tsx","service-employee-management.tsx","service-website-design.tsx"].map(f=>read("src/routes/"+f)).join("\n");
ok(prep.includes("canonical")&&prep.includes("description")&&prep.includes("BreadcrumbList"),"ON-PAGE SEO gate failed");
ok(prep.includes("PostalAddress")&&prep.includes("areaServed")&&about.includes("Telangana"),"GEO SEO gate failed");
ok(map.includes("/about-inrishi")&&map.includes("/industries")&&robots.includes("Sitemap:"),"SEARCH ENGINE SEO gate failed");
ok(robots.includes("OAI-SearchBot")&&llms.includes("canonical website")||llms.includes("Canonical website"),"AI ENGINE gate failed");
ok(svc.includes("SeoServiceSections")&&svc.includes("starting price")||svc.includes("public starting price"),"PRODUCT SEO gate failed");
if(fail.length){console.error(fail.map(x=>`ERROR: ${x}`).join("\n"));process.exit(1)}
console.log("V81 five-layer search coverage passed: On-page SEO, GEO, SEO, AI/AEO, Product SEO.");
