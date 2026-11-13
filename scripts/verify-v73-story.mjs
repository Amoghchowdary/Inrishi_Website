import fs from "node:fs";
const errors=[];const need=(ok,msg)=>{if(!ok)errors.push(msg)};const read=p=>fs.readFileSync(p,"utf8");
const home=read("src/routes/index.tsx"),css=read("src/styles.css"),footer=read("src/components/site-footer.tsx"),services=read("src/routes/services.tsx"),sitemap=read("public/sitemap.xml"),sample=read("src/routes/sample-work.tsx");
need(home.includes("Traditional")&&home.includes("Digital foundation")&&home.includes("AI-enabled"),"V73 storytelling journey is missing.");
need(home.includes("Business Website")&&home.includes("CRM")&&home.includes("Employee Management")&&home.includes("AI Automation"),"V73 primary product story is incomplete.");
need(!home.includes('title:"ERP"')&&!home.includes('type="erp"'),"ERP is still exposed as a homepage product.");
need(!services.includes('["ERP"')&&!sitemap.includes('/services/erp')&&!footer.includes('>ERP<')&&!sample.includes('type:"ERP"'),"ERP is still exposed in a public discovery surface.");
need(css.includes('.v73-public :is(')&&css.includes('color:#fff!important'),"White-only public typography override is missing.");
need(home.includes("v73-visual-grid")&&home.includes("v73-story-board")&&home.includes("v73-impact-grid"),"V73 visual storytelling blocks are missing.");
need(home.includes("v73-reel-group")&&css.includes('@keyframes v73-marquee'),"Continuous V73 product reel is missing.");
if(errors.length){console.error(errors.map(e=>`ERROR: ${e}`).join("\n"));process.exit(1)}
console.log("V73 MAIN storytelling gate passed: white typography, ERP removal, story journey, product visuals and continuous reel are present.");
