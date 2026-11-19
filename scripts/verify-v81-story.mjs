import fs from "node:fs";
const errors=[];const need=(ok,msg)=>{if(!ok)errors.push(msg)};const read=p=>fs.readFileSync(p,"utf8");
const home=read("src/routes/index.tsx"),css=read("src/styles.css"),footer=read("src/components/site-footer.tsx"),services=read("src/routes/services.tsx"),sitemap=read("public/sitemap.xml"),sample=read("src/routes/sample-work.tsx");
need(home.includes("Make your business AI-ready."),"V81 short hero headline is missing.");
need(!home.includes("How it works")&&!home.includes('href="#how"')&&!footer.includes("How it works"),"How it works must be removed from Main navigation/content/footer.");
need(home.includes("story-traditional.svg")&&home.includes("story-digital.svg")&&home.includes("story-ai.svg"),"V81 business-transformation image story is missing.");
need(home.includes("product-website.svg")&&home.includes("product-crm.svg")&&home.includes("product-ems.svg")&&home.includes("product-ai.svg"),"V81 product visual assets are incomplete.");
for(const asset of ["story-traditional.svg","story-digital.svg","story-ai.svg","product-website.svg","product-crm.svg","product-ems.svg","product-ai.svg"])need(fs.existsSync(`src/assets/${asset}`),`Missing V81 image asset: ${asset}`);
need(home.includes("v81-tile")&&home.includes("v81-slide")&&css.includes(".v81-tile:hover")&&css.includes("background:#fff!important")&&css.includes("color:var(--v81-ink)!important"),"V81 white-tile/black-text hover behavior is missing.");
need(home.includes("Business Website")&&home.includes("CRM")&&home.includes("Employee Management")&&home.includes("AI Automation"),"V81 primary product story is incomplete.");
need(!home.includes('title:"ERP"')&&!home.includes('type="erp"'),"ERP is still exposed as a homepage product.");
need(!services.includes('["ERP"')&&!sitemap.includes('/services/erp')&&!footer.includes('>ERP<')&&!sample.includes('type:"ERP"'),"ERP is still exposed in a public discovery surface.");
need(css.includes('.v73-public :is(')&&css.includes('color:#fff!important'),"White-only default public typography is missing.");
need(home.includes("v73-reel-group")&&css.includes('@keyframes v73-marquee'),"Continuous product reel is missing.");
for(const asset of ["realistic-approval-control.webp","realistic-ai-chat.webp","realistic-documents.webp"])need(fs.existsSync(`src/assets/${asset}`),`Missing V81 realistic image asset: ${asset}`);
need(home.includes("realBusinessPhotos")&&home.includes("v81-photo-grid")&&home.includes("v81-real-product-grid"),"V81 realistic business/photo storytelling is missing.");
need((home.match(/images\.unsplash\.com/g)||[]).length>=3,"V81 must include at least three realistic business photographs.");

if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V81 MAIN storytelling gate passed: realistic business photography, product scenes, white/black tile hover and continuous reel are present.");
