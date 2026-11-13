import fs from "node:fs";
const errors=[];const need=(ok,msg)=>{if(!ok)errors.push(msg)};const read=p=>fs.readFileSync(p,"utf8");
const home=read("src/routes/index.tsx"),css=read("src/styles.css"),footer=read("src/components/site-footer.tsx"),services=read("src/routes/services.tsx"),sitemap=read("public/sitemap.xml"),sample=read("src/routes/sample-work.tsx");
need(home.includes("Make your business AI-ready."),"V76 short hero headline is missing.");
need(!home.includes("How it works")&&!home.includes('href="#how"')&&!footer.includes("How it works"),"How it works must be removed from Main navigation/content/footer.");
need(home.includes("story-traditional.svg")&&home.includes("story-digital.svg")&&home.includes("story-ai.svg"),"V76 business-transformation image story is missing.");
need(home.includes("product-website.svg")&&home.includes("product-crm.svg")&&home.includes("product-ems.svg")&&home.includes("product-ai.svg"),"V76 product visual assets are incomplete.");
for(const asset of ["story-traditional.svg","story-digital.svg","story-ai.svg","product-website.svg","product-crm.svg","product-ems.svg","product-ai.svg"])need(fs.existsSync(`src/assets/${asset}`),`Missing V76 image asset: ${asset}`);
need(home.includes("v76-tile")&&home.includes("v76-slide")&&css.includes(".v76-tile:hover")&&css.includes("background:#fff!important")&&css.includes("color:var(--v76-ink)!important"),"V76 white-tile/black-text hover behavior is missing.");
need(home.includes("Business Website")&&home.includes("CRM")&&home.includes("Employee Management")&&home.includes("AI Automation"),"V76 primary product story is incomplete.");
need(!home.includes('title:"ERP"')&&!home.includes('type="erp"'),"ERP is still exposed as a homepage product.");
need(!services.includes('["ERP"')&&!sitemap.includes('/services/erp')&&!footer.includes('>ERP<')&&!sample.includes('type:"ERP"'),"ERP is still exposed in a public discovery surface.");
need(css.includes('.v73-public :is(')&&css.includes('color:#fff!important'),"White-only default public typography is missing.");
need(home.includes("v73-reel-group")&&css.includes('@keyframes v73-marquee'),"Continuous product reel is missing.");
for(const asset of ["realistic-approval-control.png","realistic-ai-chat.png","realistic-documents.png"])need(fs.existsSync(`src/assets/${asset}`),`Missing V76 realistic image asset: ${asset}`);
need(home.includes("realBusinessPhotos")&&home.includes("v76-photo-grid")&&home.includes("v76-real-product-grid"),"V76 realistic business/photo storytelling is missing.");
need((home.match(/images\.unsplash\.com/g)||[]).length>=3,"V76 must include at least three realistic business photographs.");

if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V76 MAIN storytelling gate passed: realistic business photography, product scenes, white/black tile hover and continuous reel are present.");
