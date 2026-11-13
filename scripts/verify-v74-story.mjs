import fs from "node:fs";
const errors=[];const need=(ok,msg)=>{if(!ok)errors.push(msg)};const read=p=>fs.readFileSync(p,"utf8");
const home=read("src/routes/index.tsx"),css=read("src/styles.css"),footer=read("src/components/site-footer.tsx"),services=read("src/routes/services.tsx"),sitemap=read("public/sitemap.xml"),sample=read("src/routes/sample-work.tsx");
need(home.includes("Make your business AI-ready."),"V74 short hero headline is missing.");
need(!home.includes("How it works")&&!home.includes('href="#how"')&&!footer.includes("How it works"),"How it works must be removed from Main navigation/content/footer.");
need(home.includes("story-traditional.svg")&&home.includes("story-digital.svg")&&home.includes("story-ai.svg"),"V74 business-transformation image story is missing.");
need(home.includes("product-website.svg")&&home.includes("product-crm.svg")&&home.includes("product-ems.svg")&&home.includes("product-ai.svg"),"V74 product visual assets are incomplete.");
for(const asset of ["story-traditional.svg","story-digital.svg","story-ai.svg","product-website.svg","product-crm.svg","product-ems.svg","product-ai.svg"])need(fs.existsSync(`src/assets/${asset}`),`Missing V74 image asset: ${asset}`);
need(home.includes("v74-tile")&&home.includes("v74-slide")&&css.includes(".v74-tile:hover")&&css.includes("background:#fff!important")&&css.includes("color:var(--v74-ink)!important"),"V74 white-tile/black-text hover behavior is missing.");
need(home.includes("Business Website")&&home.includes("CRM")&&home.includes("Employee Management")&&home.includes("AI Automation"),"V74 primary product story is incomplete.");
need(!home.includes('title:"ERP"')&&!home.includes('type="erp"'),"ERP is still exposed as a homepage product.");
need(!services.includes('["ERP"')&&!sitemap.includes('/services/erp')&&!footer.includes('>ERP<')&&!sample.includes('type:"ERP"'),"ERP is still exposed in a public discovery surface.");
need(css.includes('.v73-public :is(')&&css.includes('color:#fff!important'),"White-only default public typography is missing.");
need(home.includes("v73-reel-group")&&css.includes('@keyframes v73-marquee'),"Continuous product reel is missing.");
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V74 MAIN storytelling gate passed: short hero, no How-it-works, richer visual assets, white/black tile hover and continuous reel are present.");
